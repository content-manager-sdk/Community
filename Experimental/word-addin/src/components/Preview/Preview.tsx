import * as React from "react";
import { inject, observer } from "mobx-react";
import {
	ITrimMainObject,
	ITrimConnector,
	IRecord,
} from "src/trim-coms/trim-connector";
import BaseObjectTypes from "src/trim-coms/trim-baseobjecttypes";
interface IPreviewProps {
	record: ITrimMainObject;
	trimConnector?: ITrimConnector;
}

interface IPreviewState {
	previewUrl: string;
}

export class Preview extends React.Component<IPreviewProps, IPreviewState> {
	constructor(props: IPreviewProps) {
		super(props);

		this.state = {
			previewUrl: "",
		};
	}

	private async setPreviewUrl() {
		const { trimConnector, record } = this.props;
		const results = await trimConnector!.search<IRecord>({
			q: `unkUri:${record.Uri}`,
			trimType: BaseObjectTypes.Record,
			properties: "ChildRenditions,RecordIsElectronic",
		});

		let url = "file/html";

		if (results.results.length > 0) {
			if ((results.results[0] as any).IsElectronic.Value === true) {
				const pdfRendition = (results.results[0] as any).ChildRenditions.find(
					(rend: any) => {
						return rend.RecordRenditionExtension.Value === "pdf";
					}
				);
				if (pdfRendition) {
					url = `rendition/${pdfRendition.RecordRenditionTypeOfRendition.Value}`;
				}
			} else {
				url = "";
			}
		}
		this.setState({ previewUrl: url });
	}

	componentDidMount() {
		this.setPreviewUrl();
	}

	componentDidUpdate(prevProps: IPreviewProps, prevState: IPreviewState) {
		if (prevProps.record.Uri !== this.props.record.Uri) {
			this.setPreviewUrl();
		}
	}

	public render(): JSX.Element {
		const { previewUrl } = this.state;
		const { trimConnector, record } = this.props;

		const servicePath = trimConnector!.getServiceAPIPath();

		return (
			<React.Fragment>
				{previewUrl === "" && <div>No Preview</div>}
				{previewUrl !== "" && (
					<iframe
						style={{
							width: "100%",
							marginTop: "8px",
							borderWidth: "0",
							marginRight: "-10px",
						}}
						onLoad={(event) => {
							const elDistanceToTop =
								window.pageYOffset +
								(event.target as any).getBoundingClientRect().top;
							var nh = window.innerHeight - (elDistanceToTop + 20);

							(event.target as any).style.height = nh + "px";
						}}
						src={`${servicePath}/Record/${record.Uri}/${previewUrl}?inline=true`}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(Preview));
