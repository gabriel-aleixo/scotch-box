import {Component} from "@wordpress/element";
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import {highlightIcon} from '../library/utils'

class SidebarFeedbackPanel extends Component {
    constructor() {
        super(...arguments);
        this.state={
            isHighlightOn: true,
        },

        this.countableCategoriesKeys = {
            WordsCount:'wordCount',
        };

        this.countableCategoriesMessage = {
            WordsCount:'Word Count',
        };
    }

    titlePanel(feedback){
        const items = [];
        const {measures,optimizeStatus,panelTitle} = this.props;



        if(optimizeStatus.isBusy || this.hidePanelCheck(feedback) ){
            return ('');
        }

        measures.map((measure)=>{
            if (feedback.data.hasOwnProperty(measure)) {
                if(measure === "PercentageParagraphsIdealWordCount"){
                    items.push(this.getDetailsWithButtonsHTML(measure,feedback.data[measure]));
                }else{
                    items.push(this.getDetailsHTML(measure,feedback.data[measure]));
                }
            }
        });


        return (
            <React.Fragment>
            <Panel >
                <PanelBody
                    title={panelTitle}
                    initialOpen={true}
                    className={'sidebar-title-header'}
                >
                    <PanelRow>
                        <ul className="collapse" id="criticalTitleIssues">
                            {items}
                        </ul>
                    </PanelRow>
                </PanelBody>
            </Panel>
            {/*<hr className={'ar-line'}/>*/}
            </React.Fragment>
        );
    };

    hidePanelCheck(feedback){

        let hidePanel = true;

        const {measures} = this.props;

        measures.map((measure)=>{
            if(feedback.data.hasOwnProperty(measure)){
                if(feedback.data[measure].state === false){
                    hidePanel = false;
                }

            }
        });



        return hidePanel;
    }

    ToggleIsHighlightOnState(){
        this.setState((currentState) => ({
            isHighlightOn: !currentState.isHighlightOn,
        }));
    }

    getDetailsWithButtonsHTML(measure,data){

        if(!data.message || data.state)
            return true;

        const {cardSelectionCallback} = this.props;
        const {isHighlightOn} = this.state;

        return (
            <React.Fragment key={measure}>
                <li className="list-group-item">
                    <div style={{marginRight:'5px'}} className={`dashicons ${(data.state) ? "blueColour dashicons-yes-alt" : "orangeColour  dashicons-dismiss"}`} />
                    <div>
                        {data.message}
                        <button className={`components-button ar-center is-default is-button ${(isHighlightOn) ? '' : 'highlighting'}`} onClick={()=>{
                            this.ToggleIsHighlightOnState();
                            cardSelectionCallback(measure,isHighlightOn);
                        }}>
                            {highlightIcon}
                        </button>
                    </div>

                </li>
            </React.Fragment>
        );
    }

    getDetailsHTML(measure,data){
        if(!data.message || data.state)
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
                <li className="list-group-item">
                    <div style={{marginRight:'5px'}} className={`dashicons ${(data.state) ? "blueColour dashicons-yes-alt" : "orangeColour  dashicons-dismiss"} ${heightAdjustment}`} />
                    {countMessage.length > 0 &&
                        <React.Fragment>
                            {countMessage}
                            <br/>
                        </React.Fragment>
                    }
                    <div>{data.message}</div>
                </li>
            </React.Fragment>
        );
    }

    render() {
        const {feedback,optimizeStatus} = this.props;

        return (
            <React.Fragment>
                {(optimizeStatus.hasClicked && Object.keys(feedback).length > 0) ? this.titlePanel(feedback) : ''}
            </React.Fragment>


        )
    }
}


export default SidebarFeedbackPanel;
