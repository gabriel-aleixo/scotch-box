import {Component} from "@wordpress/element";
import { Panel, PanelBody, PanelRow } from '@wordpress/components';

class SidebarFeedbackPanel extends Component {
    constructor() {
        super(...arguments);
        this.titlePanel.bind(this);
        this.getDetailsHTML.bind(this);
        this.titleCategories = {
            TitleWordsCount: 'Character and Word Count',
            TitleCharacterCount: 'Character and Word Count',
            TitleContains5W1H: 'Style',
            TitleContainsNumbers: 'Style',
            TitlePolarity: 'Style',
            TitlePronounPerson: 'Style',
            TitleQuestion: 'Style',
            TitleSuperlatives: 'Style',
            TitleTopicLocation: 'Topics',
            TitleTopicsCount: 'Topics',
        };

        this.countableCategoriesKeys = {
            TitleWordsCount:'wordCount',
            TitleCharacterCount:'characterCount',
        };

        this.countableCategoriesMessage = {
            TitleWordsCount:'Word Count',
            TitleCharacterCount:'Character Count',
        };
    }


    componentDidMount() {
        // console.log("SidebarFeedbackPanel::comp did mount!", this.state, this.props);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("SidebarFeedbackPanel:: did update: ", prevProps, prevState, this.state, this.props);
        // this.updateProfileState();
    }

    hidePanelCheck(feedback){

        let hidePanel = true;

        const {bodyMeasures} = this.props;

        bodyMeasures.map((measure)=>{
            if(feedback.data.hasOwnProperty(measure)){
                if(feedback.data[measure].state === false){
                    hidePanel = false;
                }

            }
        });
        return hidePanel;
    }


    titlePanel(feedback){

        const {titleMeasures,optimizeStatus} = this.props;

        if(optimizeStatus.isBusy){
            return ('');
        }

        let categoryList = {};
        let itemList = [];
        titleMeasures.map((measure)=>{

            if(typeof categoryList[this.titleCategories[measure]] === 'undefined')
                categoryList[this.titleCategories[measure]] = [];

            if (feedback.data.hasOwnProperty(measure)) {
                if(measure === "TitleTopicsCount" ) {
                    categoryList[this.titleCategories[measure]].push(this.getDetailsWithTagsHTML(measure, feedback.data[measure], feedback.data['Topics']));
                }else {
                    categoryList[this.titleCategories[measure]].push(this.getDetailsHTML(measure, feedback.data[measure]));
                }
            }
        });

        Object.keys(categoryList).forEach((category)=>{
            itemList.push (
                <div>
                    <h3> {category} </h3>
                    {categoryList[category]}
                </div>
            );

        });


        return (
            <React.Fragment>
                <Panel >
                    <PanelBody
                        title="Title Insights"
                        initialOpen={this.hidePanelCheck(feedback)}
                        className={'sidebar-title-header'}
                    >
                        <PanelRow>
                            <ul className="collapse" id="criticalTitleIssues">
                                {itemList}
                            </ul>
                        </PanelRow>
                    </PanelBody>
                </Panel>
                {/*<hr className={'ar-line'}/>*/}
            </React.Fragment>
        );
    };

    getDetailsWithTagsHTML(measure,data,topics){
        if(!data.message)
            return true;

        let tags = "";

        if(topics.detail && topics.detail.length > 0){
            tags = topics.detail.map((tag,i) => <span key={i} className={"badge badge-blue mr-1"}>{tag}</span> );
            //@todo: Empty tag variable if condition is not true.
        }

        return (
            <React.Fragment key={measure}>
                <li className="list-group-item improvementBlock">
                    <span style={{marginRight:'5px'}} className={`dashicons ${(data.state) ? "blueColour dashicons-yes-alt" : "orangeColour  dashicons-warning"}`} />
                    <div>
                        <div>{data.message}</div>
                        <div style={{marginTop:'5px'}}> {tags} </div>
                    </div>
                </li>
            </React.Fragment>
        );
    }

    getDetailsHTML(measure,data){
        if(!data.message)
            return true;

        let countMessage = '';
        let heightAdjustment = '';
        if(measure in this.countableCategoriesKeys){
            heightAdjustment = 'countIcon';
            countMessage = this.countableCategoriesMessage[measure]+': '+
                data[this.countableCategoriesKeys[measure]] ;
        }

        return (
            <React.Fragment key={measure}>
                <li className="list-group-item improvementBlock">
                    <span style={{marginRight:'5px'}} className={`dashicons ${(data.state) ? "blueColour dashicons-yes-alt" : "orangeColour  dashicons-warning"} ${heightAdjustment}`} />
                    <div>
                        {countMessage.length > 0 && <div>{countMessage}</div>}
                        <div>{data.message}</div>
                    </div>
                </li>
            </React.Fragment>
        );
    }

    render() {
        const {feedback,optimizeStatus} = this.props;
        return (
            <React.Fragment>
                {(optimizeStatus.hasClicked && Object.keys(feedback).length > 0 ) ? this.titlePanel(feedback) : ''}
            </React.Fragment>



        )
    }
}


export default SidebarFeedbackPanel;
