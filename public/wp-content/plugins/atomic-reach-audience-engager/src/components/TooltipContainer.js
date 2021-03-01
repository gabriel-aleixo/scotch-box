import { Component } from "@wordpress/element";
import { Button, Tooltip } from "@wordpress/components";

/**
 * Optimize button component.
 * Expected props:
 * @param {Boolean} visibility - Show button inside tooltip on true.
 * @param {String} text - Tooltip text
 * @param {String} position - Tooltip position (a.e. 'top')
 * @param {Object} optimizeButton - Flags object: {disabled, isBusy, hasClicked}
 * @param {Function} clickHandler - Callback executed on button click.
 */
class TooltipContainer extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Cancels event, executes clickHandler() prop on button click.
   * @param {Object} event - Click event.
   */
  handleClick(event) {
    const { clickHandler } = this.props;
    event.preventDefault();
    event.stopPropagation();
    clickHandler();
  };

  render() {
    const { visibility, text, position, optimizeButton } = this.props;

    const button = (
      <span className={optimizeButton.disabled ? "disabled-container" : ""}>
        <Button
          id={"atomicreach-optimize-button"}
          onClick={this.handleClick}
          isBusy={optimizeButton.isBusy}
          disabled={optimizeButton.disabled}
          isLarge
        >
          {optimizeButton.isBusy ? "Optimizing" : "Optimize"}
        </Button>
      </span>
    );

    return visibility ? (
      <Tooltip text={text} position={position}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  }
}

export default TooltipContainer;
