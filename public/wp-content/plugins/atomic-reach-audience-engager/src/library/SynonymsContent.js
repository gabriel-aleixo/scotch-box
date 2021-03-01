import React from 'react';

export default function SynonymContent(props) {
    const {
        disabledWords,
        flagWord,
        alternatives,
        replaceWord,
        wordFlags,
        updateDisabledWords,
        message,
    } = props;
    let result = 'No other suggestions';

    if (alternatives.length > 0) {
        result = alternatives.map((synonym, i) => (
            <li
                key={i}
                className={`list-group-item synonymsReplacementWord ${disabledWords.indexOf(`${synonym}${i}`) !== -1 ? 'disabled' : ''}`}
            >
        <span
            tabIndex="0"
            role="button"
            className="replacement-word arPopoveReplacementWordItem"
            onClick={(e) => {
                if (disabledWords.indexOf(`${synonym}${i}`) !== -1) return;
                replaceWord(e);
            }}
            onKeyDown={() => {
            }}
        >
                {synonym}
        </span>
                {(() => {
                    if (wordFlags) {
                        return (
                            <span
                                tabIndex="0"
                                role="button"
                                className="bad-word-flag arBadWord"
                                onClick={() => {
                                    flagWord(synonym, '-');
                                    const words = disabledWords.slice();
                                    words.push(`${synonym}${i}`);
                                    updateDisabledWords(words);
                                }}

                            >
                        <span className="dashicons dashicons-flag redColour"/>
              </span>
                        );
                    }
                })()}
            </li>
        ));
    }

    return (
        <React.Fragment>
            {(() => {
                if (message.length) {
                    return (
                        <p className="popover-message">
                            {message}
                        </p>
                    );
                }
            })()}
            <ul className="list-group pre-scrollable">
                {result}
            </ul>
        </React.Fragment>
    );
}


