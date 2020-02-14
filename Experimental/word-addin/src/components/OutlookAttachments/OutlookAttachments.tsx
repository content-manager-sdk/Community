import * as React from "react";
import { inject, observer } from "mobx-react";
import { IAppStore, AppStoreBase } from "../../stores/AppStoreBase";
import {
	ITrimConnector,
	ITrimMainObject,
	IDatabase,
} from "../../trim-coms/trim-connector";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import { IOutlookAttachment } from "../../office-coms/OutlookConnector";
import { IOfficeConnector } from "../../office-coms/office-connector";
import {
	Spinner,
	SpinnerSize,
	Checkbox,
	PrimaryButton,
} from "office-ui-fabric-react";
import NewRecord from "../NewRecord";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import RecordTypePicker from "../RecordTypePicker/RecordTypePicker";
import { Text } from "office-ui-fabric-react/lib/Text";

interface IOutlookAttachmentsProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
}

interface IOutlookAttachmentsState {
	selectedAttachments: IOutlookAttachment[];
	spinning: boolean;
	autoCreate: boolean;
	showForm: Boolean;
}

export class OutlookAttachments extends React.Component<
	IOutlookAttachmentsProps,
	IOutlookAttachmentsState
> {
	constructor(props: IOutlookAttachmentsProps) {
		super(props);

		this.state = {
			selectedAttachments: [],
			spinning: false,
			autoCreate: true,
			showForm: false,
		};
	}

	private _onRecordTypeSelected = (
		attachmentId: string,
		uri: number,
		isCheckinStyle: Boolean
	) => {
		const { selectedAttachments } = this.state;

		selectedAttachments.forEach((selectedAttachment) => {
			if (selectedAttachment.Id === attachmentId) {
				selectedAttachment.FileUsing = {
					Uri: uri,
					TrimType: isCheckinStyle
						? BaseObjectTypes.CheckinStyle
						: BaseObjectTypes.RecordType,
				};
			}
		});

		this.setState({
			selectedAttachments: [...selectedAttachments],
		});
	};

	private allChecked = false;
	private _onAttachmentsChange = (
		attachment: IOutlookAttachment,
		checked: Boolean | undefined
	) => {
		const { selectedAttachments } = this.state;

		if (checked) {
			this.setState({
				selectedAttachments: [...selectedAttachments, attachment],
			});
		} else {
			const newArray = selectedAttachments.filter((a) => {
				return attachment.Id !== a.Id;
			});
			this.setState({
				selectedAttachments: newArray,
			});
		}
	};

	private _setAttachments = (attachments: IOutlookAttachment[]) => {
		const { selectedAttachments } = this.state;
		const selAttachments = [...selectedAttachments];

		if (attachments.length > 0) {
			attachments.forEach((a) => {
				if (selAttachments.filter((sa) => sa.Id === a.Id).length === 0) {
					selAttachments.push(a);
				}
			});

			this.setState({
				selectedAttachments: selAttachments,
			});
		} else {
			this.setState({
				selectedAttachments: [],
			});
		}
	};

	private _nextClick = () => {
		const { selectedAttachments } = this.state;
		const { trimConnector, wordConnector, appStore } = this.props;
		const attachment = selectedAttachments.find((a) => a.Filed !== true);

		if (!attachment) {
			return;
		}
		this.setState({ spinning: true });
		wordConnector!
			.getWebUrl()
			.then((webUrl) => {
				trimConnector!
					.getDriveId(
						`${webUrl}/attachments/${attachment.Id}`,
						true,
						0,
						attachment.Name
					)
					.then((driveInfo) => {
						appStore!.setDocumentInfo(driveInfo);
						this.setState({ showForm: true, spinning: false });
					})
					.catch((e) => {
						appStore!.setError(e);
						this.setState({ spinning: false });
					});
			})
			.catch((e) => {
				appStore!.setError(e);
				this.setState({ spinning: false });
			});
	};

	private _fullUrn: string[] = [];

	private _trimObjectCreated = (c: ITrimMainObject) => {
		const { appStore, wordConnector, trimConnector } = this.props;
		const { selectedAttachments, autoCreate } = this.state;

		appStore!.setDocumentInfo({
			...(appStore! as AppStoreBase).documentInfo,
			EmailPath: "",
		});

		for (let counter = 0; counter < selectedAttachments.length; counter++) {
			if (!selectedAttachments[counter].Filed) {
				this._fullUrn.push(c.URN!);
				selectedAttachments[counter].Filed = true;
				break;
			}
		}

		this.setState({ selectedAttachments: [...selectedAttachments] });

		if (this._fullUrn.length === selectedAttachments.length) {
			trimConnector!.getDatabaseProperties().then((database: IDatabase) => {
				wordConnector!.setAutoOpen(
					false,
					this._fullUrn.join(";"),
					database.EmailSubjectPrefix
				);
			});
		} else {
			if (autoCreate) {
				this._nextClick();
			}
		}
	};

	private _autoCreate = () => {
		const { autoCreate } = this.state;

		this.setState({ autoCreate: !autoCreate });
	};

	public render() {
		const { appStore, wordConnector } = this.props;
		const { selectedAttachments, autoCreate, spinning, showForm } = this.state;

		if (appStore!.status === "STARTING") {
			return <Spinner size={SpinnerSize.large} />;
		}

		const attachments = (wordConnector as OutlookConnector).getAttachments();
		const attachment = selectedAttachments.find((a) => a.Filed !== true);
		const spinningLabel = attachment
			? `${appStore!.messages.web_fetching} ${attachment.Name}`
			: "";

		return showForm === true ? (
			<React.Fragment>
				{spinning && (
					<Spinner
						className="trim-edit-spinner-label"
						size={SpinnerSize.large}
						label={spinningLabel}
					/>
				)}
				<NewRecord
					trimType={BaseObjectTypes.Record}
					onTrimObjectCreated={this._trimObjectCreated}
					onAfterSave={() => {
						this.setState({ showForm: false });
					}}
					defaultRecordType={attachment ? attachment.FileUsing : undefined}
					processInBackgroundIfPossible={autoCreate}
					bypassUpdateEmailSubject={true}
				/>
			</React.Fragment>
		) : (
			<React.Fragment>
				{spinning && (
					<Spinner
						className="trim-edit-spinner-label"
						size={SpinnerSize.large}
						label={spinningLabel}
					/>
				)}
				<div hidden={spinning}>
					{attachments.length === 0 ? (
						<Text variant="large">{appStore!.messages.web_noAttachments}</Text>
					) : (
						<React.Fragment>
							<Checkbox
								className="ms-fontWeight-semibold"
								key="all_select"
								label={appStore!.messages.web_attachmentName}
								onChange={() => {
									if (this.allChecked) {
										this._setAttachments([]);
									} else {
										this._setAttachments(attachments);
									}
									this.allChecked = !this.allChecked;
								}}
								onRenderLabel={(props) => {
									return (
										<span className="ms-Checkbox-text ms-fontWeight-semibold">
											{props!.label}
										</span>
									);
								}}
							/>
							{attachments.map((attachment: IOutlookAttachment) => {
								const selectedAttachment = selectedAttachments.find(
									(a) => a.Id === attachment.Id
								);
								return (
									<div key={attachment.Id}>
										<Checkbox
											label={attachment.Name}
											onChange={(el, checked) =>
												this._onAttachmentsChange(attachment, checked)
											}
											checked={selectedAttachment !== undefined}
											disabled={
												selectedAttachment && selectedAttachment.Filed === true
											}
										></Checkbox>
										{selectedAttachments.filter(
											(a) => a.Id === attachment.Id && !a.Filed
										).length > 0 && (
											<RecordTypePicker
												includeCheckinStyles={true}
												onRecordTypeSelected={(uri, isCheckinStyle) =>
													this._onRecordTypeSelected(
														attachment.Id,
														uri,
														isCheckinStyle
													)
												}
												defaultRecordType={selectedAttachment!.FileUsing}
											/>
										)}
									</div>
								);
							})}
							<hr />
							<Checkbox
								label={appStore!.messages.web_suppressDataEntryForm}
								onChange={this._autoCreate}
								checked={autoCreate}
							/>
							<hr />
							<PrimaryButton
								key="next"
								text={appStore!.messages.vb_nts_Next}
								disabled={
									!(
										selectedAttachments.filter((sel) => {
											return sel.FileUsing;
										}).length === selectedAttachments.length
									) || selectedAttachments.length == 0
								}
								onClick={() => this._nextClick()}
							/>{" "}
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(OutlookAttachments));
