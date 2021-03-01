import {
    GRAMMAR_POPOVER,
    OPTIMIZE_API_POPOVER,
} from '../constants';

import SynonymsContent from "./SynonymsContent";
import GrammarSpellingContent from "./GrammarSpellingContent";

import {Component} from "@wordpress/element";

class GenericPopover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabledWords: [],
        };
        this.wrapperRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', (event)=>{this.handleClickOutside(event)});
    }

    componentDidUpdate() {
        const {
            isOpen,
            repositionPopover,
            target,
        } = this.props;
        if (isOpen) {
            repositionPopover(target);
        }
    }

    flagWord(replaceWord, feedBackType) {
        const { flagFunction } = this.props;
        flagFunction(replaceWord, feedBackType);
    };

    updateDisabledWords(words){
        this.setState({
            disabledWords: words,
        });
    }

    getContent () {
        const { type } = this.props;

        switch (type) {
            case GRAMMAR_POPOVER:
                return this.getGrammarContent();
            case OPTIMIZE_API_POPOVER:
                return this.getOptimizeContent();
            default:
                return null;
        }
    }

    getGrammarContent(){
        const {
            popoverFeedback,
            wordReplacedCallback,
            originalText,
        } = this.props;

        return (
            <GrammarSpellingContent
                feedback={popoverFeedback}
                originalText={originalText}
                replaceWord={(e) => {
                    wordReplacedCallback(e);
                }}
            />
        );
    };

    getOptimizeContent(){
        const {
            popoverFeedback,
            wordReplacedCallback,
            wordFlags,
        } = this.props;
        const { disabledWords } = this.state;
        const alternativesArray = popoverFeedback.alternatives;

        if(popoverFeedback.powerWords.length > 0){
            alternativesArray.unshift(popoverFeedback.powerWords);
        }

        if (popoverFeedback.replacement !== null && alternativesArray.indexOf(popoverFeedback.replacement)) {
            alternativesArray.unshift(popoverFeedback.replacement);
        }



        return (
            <SynonymsContent
                alternatives={alternativesArray}
                replaceWord={(e) => {
                    wordReplacedCallback(e);
                }}
                disabledWords={disabledWords}
                flagWord={(replaceWord, feedBackType) => {
                    this.flagWord(replaceWord, feedBackType);
                }}
                wordFlags={wordFlags}
                message={''}
                updateDisabledWords={(word)=>{
                    this.updateDisabledWords(word)
                }}
            />
        );
    };

    handleClickOutside(event){
        const { close, isOpen } = this.props;
        if ((this.wrapperRef.current !== null  && !this.wrapperRef.current.contains(event.target)) && isOpen) {
            close();
        }
    };


    render() {
        const {
            isOpen,
            originalText,
            className,
            wordReplacedCallback,
            addToDictionary,
            type
        } = this.props;


        if (!isOpen) return null;

        return (
            <div className={`ar-popover popover ${isOpen ? 'show' : ''} ${className}`} ref={this.wrapperRef}>
                <div className="ar-popover-header">
                    {type === OPTIMIZE_API_POPOVER && 'Original: '}
                    <span
                        tabIndex="0"
                        role="button"
                        className={type === OPTIMIZE_API_POPOVER ? 'replacement-word arPopoveReplacementWordItem' : ''}
                        onClick={(e) => {
                            if (type === OPTIMIZE_API_POPOVER) {
                                wordReplacedCallback(e);
                            }
                        }}
                        onKeyDown={() => {}}
                    >
            {originalText}
          </span>
                </div>
                <div className="ar-popover-body">
                    {this.getContent()}
                    {addToDictionary
                    && (
                        <div className="flex-fill">
                            <button
                                type="button"
                                className="btn btn-link text-sm-left arPopoverAddToDictionary"
                                onClick={() => {
                                    addToDictionary();
                                }}
                            >
                                Add to dictionary
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default GenericPopover;

