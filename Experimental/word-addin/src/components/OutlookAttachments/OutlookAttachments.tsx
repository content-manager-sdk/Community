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
import { Checkbox, PrimaryButton } from "office-ui-fabric-react";
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
	attachments: IOutlookAttachment[];
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
			attachments: [],
		};
	}

	componentDidMount() {
		const { wordConnector } = this.props;

		const attachments = (wordConnector as OutlookConnector).getAttachments();

		this.setState({
			attachments,
			autoCreate: attachments.length > 1,
			selectedAttachments: attachments.length === 1 ? [attachments[0]] : [],
		});
	}

	private _onRecordTypeSelected = (
		attachmentId: string,
		uri: number,
		isCheckinStyle: Boolean
	) => {
		const { selectedAttachments, attachments } = this.state;

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

		if (attachments.length === 1) {
			this._nextClick();
		}
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
		//	this.setState({ spinning: true });
		appStore!.setSpinning(true);
		appStore!.setFileName(attachment.Name);

		wordConnector!
			.getWebUrl()
			.then((webUrl) => {
				trimConnector!
					.getDriveId(
						attachment.IsAttachment
							? `${webUrl}/attachments/${attachment.Id}`
							: webUrl,
						true,
						0,
						attachment.IsAttachment ? attachment.Name : undefined
					)
					.then((driveInfo) => {
						appStore!.setDocumentInfo(driveInfo);
						this.setState({ showForm: true });
						appStore!.setSpinning(false);
					})
					.catch((e) => {
						appStore!.setError(e);
						appStore!.setSpinning(false);
					});
			})
			.catch((e) => {
				appStore!.setError(e);
				appStore!.setSpinning(false);
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

	private renderPicker = (
		attachment: IOutlookAttachment,
		selectedAttachment: IOutlookAttachment | undefined
	) => {
		return (
			<RecordTypePicker
				includeCheckinStyles={true}
				onRecordTypeSelected={(uri, isCheckinStyle) =>
					this._onRecordTypeSelected(attachment.Id, uri, isCheckinStyle)
				}
				defaultRecordType={selectedAttachment!.FileUsing}
			/>
		);
	};

	public render() {
		const { appStore } = this.props;
		const {
			selectedAttachments,
			autoCreate,
			spinning,
			showForm,
			attachments,
		} = this.state;

		// if (appStore!.status === "STARTING") {
		// 	return <Spinner size={SpinnerSize.large} />;
		// }

		const attachment = selectedAttachments.find((a) => a.Filed !== true);
		const spinningLabel = attachment
			? `${appStore!.messages.web_fetching} ${attachment.Name}`
			: "";
		appStore!.setSpinning(spinning, spinningLabel);
		return showForm === true ? (
			<React.Fragment>
				{/* {spinning && (
					<Spinner
						className="trim-edit-spinner-label"
						size={SpinnerSize.large}
						label={spinningLabel}
					/>
				)} */}
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
		) : attachments.length === 1 ? (
			this.renderPicker(attachments[0], attachments[0])
		) : (
			<React.Fragment>
				{/* {spinning && (
					<Spinner
						className="trim-edit-spinner-label"
						size={SpinnerSize.large}
						label={spinningLabel}
					/>
				)} */}
				<div hidden={spinning}>
					(
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
								<React.Fragment key={attachment.Id}>
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
										/>
										{selectedAttachments.filter(
											(a) => a.Id === attachment.Id && !a.Filed
										).length > 0 &&
											this.renderPicker(attachment, selectedAttachment)}
									</div>
									{attachment.IsAttachment === false &&
										attachments.length > 1 && (
											<Text variant="large">
												{appStore!.messages.core_mailAttachmentsCap}
											</Text>
										)}
								</React.Fragment>
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
