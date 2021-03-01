import {Component} from "@wordpress/element";

class SidebarFeedbackPanel extends Component {
    constructor() {
        super(...arguments);

    }

    componentDidMount() {
        // console.log("SidebarFeedbackPanel::comp did mount!", this.state, this.props);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("SidebarFeedbackPanel:: did update: ", prevProps, prevState, this.state, this.props);
        // this.updateProfileState();
    }

    //This is a placeholder
    listIssuesSummary() {
        if(this.props.feedback) {

            const {summaryIssues} = this.props.feedback;
            const message = `you have ${summaryIssues.critical} critical issue(s) and ${summaryIssues.stylistic} stylistic issue(s)`;
            return (
                <p>{message}</p>
            );
        } else {
            return null;
        }

    }

    render() {
        // Create separate components for each view.
        return (
            <div>
                {this.listIssuesSummary()}
            </div>

        )
    }

}

export default SidebarFeedbackPanel;
