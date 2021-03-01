import GenericPopover from "./GenericPopover";
import React from 'react';
import { isEmpty } from '../library/EditorLib';
import {ATD_TEXT_ANALYZE_URL, ATOMICREACH_API_NAMESPACE} from '../constants';
import {Component} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";


class GrammarSpellingContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      atdResponse: '',
    };
  }

  componentDidMount() {
    const {
      feedback
    } = this.props;


    if (feedback.url) {
      this.setAtd();
      this.getAtdResponse().then((data) => {
        this.setAtd(data);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      feedback,
      originalText,
      arClient,
    } = this.props;

    if (feedback.url && originalText !== prevProps.originalText && !isEmpty(arClient)) {
      this.setAtd();
      this.getAtdResponse().then((data) => {
        this.setAtd(data);
      });
    }
  }

  getAtdResponse(){
    const { originalText } = this.props;
    return new Promise((resolve) => {
      const url = ATOMICREACH_API_NAMESPACE + ATD_TEXT_ANALYZE_URL;
      apiFetch({
        path: url,
        method: 'POST',
        data: {
          text: originalText,
        }
      }).then((response) =>{
        resolve(response);
      });

    });
  };

  setAtd(data = ''){
    if (!data) {
      this.setState({
        atdResponse: { __html: '<p>Loading data... Please wait!</p>' },
      });
      return;
    }
    this.setState({
      atdResponse: { __html: data },
    });
  }

  render() {
    const { feedback, replaceWord } = this.props;
    const { atdResponse } = this.state;

    const {suggestions} = feedback;



    if (feedback.url && atdResponse) {
      return <div id="atdWrapper" dangerouslySetInnerHTML={atdResponse} />;
    }

    if ('message' in feedback) {
      return <div id="complianceWrapper">{feedback.message}</div>;
    }

    if (!suggestions[0]) {
      return null;
    }

    return (
      <React.Fragment>
        <p className="spellingPopoverSummary">{suggestions[0][0]}</p>
        <ul className="list-group pre-scrollable">
          {
            suggestions[0][1].map((str, i) => {
              return (
                <li
                  key={i}
                  className="list-group-item spellingGrammarReplacementWord arPopoveReplacementWordItem"
                >
                  <span
                    tabIndex="0"
                    role="button"
                    className="replacement-word arPopoveReplacementWordItem"
                    onClick={(e) => {
                      replaceWord(e);
                    }}
                    onKeyDown={() => {}}
                  >
                    {str}
                  </span>
                </li>
              );
            })
          }
        </ul>
      </React.Fragment>
    );
  }
}


export default GrammarSpellingContent;