using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HP.HPTRIM.SDK;
using log4net;
using log4net.Config;

namespace CMRamble.EventProcessor.WorkflowCheckInStyles
{
    public class Addin : TrimEventProcessorAddIn
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Addin));
        public override void ProcessEvent(Database db, TrimEvent evt)
        {
            XmlConfigurator.Configure();
            switch (evt.EventType)
            {
                case Events.ActivityAssigned:
                case Events.ActivityReassigned:
                case Events.ActivityCompleted:
                case Events.ActivityUndone:
                case Events.ActivityCurrent:
                case Events.ActivitySkipped:
                case Events.ActivityNeedsAuthorization:
                    ManageCheckInStyle(db, evt);
                    break;
                default:
                    break;
            }
        }

        private void ManageCheckInStyle(Database db, TrimEvent evt)
        {
            try
            {
                Activity activity = new Activity(db, evt.ObjectUri);
                if ( activity != null && activity.AssignedTo != null )
                {
                    log.Debug($"Activity Uri {evt.ObjectUri}");
                    Workflow workflow = activity.Workflow;
                    if ( workflow != null && (workflow.Initiator != null && workflow.Initiator.RecordType.UsualBehaviour == RecordBehaviour.Folder) )
                    {
                        if ( workflow.IsComplete )
                        {
                            log.Debug($"Workflow Uri {workflow.Uri} Is Completed");
                            // when no other assigned activities for this container 
                            TrimMainObjectSearch activitySearch = new TrimMainObjectSearch(db, BaseObjectTypes.Activity)
                            {
                                SearchString = $"workflow:[initiator:{workflow.Initiator.Number}] assignee:{activity.AssignedTo.Uri} not done"
                            };
                            if (activitySearch.Count == 0 )
                            {   // there are no other assigned activities
                                TrimMainObjectSearch styleSearch = new TrimMainObjectSearch(db, BaseObjectTypes.CheckinStyle)
                                {
                                    SearchString = $"owner:{activity.AssignedTo.Uri} container:{workflow.Initiator.Number}"
                                };
                                foreach (CheckinStyle style in styleSearch)
                                {
                                    style.Delete();
                                }
                            }
                        }
                        else
                        {
                            log.Debug($"Workflow Uri {workflow.Uri} not completed");
                            // ensure that there is a check-in style for this container
                            TrimMainObjectSearch styleSearch = new TrimMainObjectSearch(db, BaseObjectTypes.CheckinStyle)
                            {
                                SearchString = $"owner:{activity.AssignedTo.Uri} container:{workflow.Initiator.Number}"
                            };
                            if ( styleSearch.Count == 0 )
                            {
                                log.Debug($"Creating new check-in style");
                                CheckinStyle style = new CheckinStyle(workflow.Initiator);
                                style.RecordType = new RecordType(db, "Document");
                                style.Name = workflow.Initiator.Title;
                                style.StyleOwner = activity.AssignedTo;
                                style.MoveToDeletedItems = false;
                                style.Save();
                            } else
                            {
                                log.Info("Check-in style already exists");
                            }
                        }
                    }
                }
            }
            catch ( TrimException ex )
            {
                log.Error($"Exception: {ex.Message}", ex);
            }
            finally
            {
            }
        }

    }
}
