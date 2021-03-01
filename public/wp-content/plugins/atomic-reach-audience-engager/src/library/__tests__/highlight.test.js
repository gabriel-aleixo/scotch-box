import {
  getCleanParagraphCount,
  evalParagraph,
  getFeedbackBlockData
} from "../highlight";
import { getHTMLFromBlock } from "../utils";

  describe("getCleanParagraphCount()", () => {
    test("should be equal length with clean text", () => {
      const paragraph = "this is a text.";
      expect(getCleanParagraphCount(paragraph)).toBe(15);
    });
    test("should skip tags with simple html", () => {
      const paragraph = "<p class='abc'>this is a text.</p>";
      expect(getCleanParagraphCount(paragraph)).toBe(15);
    });
    test("should skip tags with nested html", () => {
      const paragraph =
        "<p>this <b>is</b> a text.<br> 1 line. <br /> 2 line.</p>";
      expect(getCleanParagraphCount(paragraph)).toBe(32);
    });
  });
  describe("evalParagraph()", () => {
    test("should return null if no paragraph", () => {
      const paragraph = "";
      const feedbackItem = {};
      expect(evalParagraph("", feedbackItem)).toBeNull();
      expect(evalParagraph(undefined, feedbackItem)).toBeNull();
      expect(evalParagraph(null, feedbackItem)).toBeNull();
    });

    test("should return null if invalid feedback item", () => {
      expect(evalParagraph("this is a paragraph", {})).toBeNull();
    });

    test("should return null if word idx bigger than paragraph length", () => {
      const paragraph = "<p>test</p>";
      const feedbackItem = {
        "4": {
          alternatives: ["had", "did", "took"],
          idx: 20,
          replacement: "gave",
          text: "made",
          ws: " "
        }
      };
      expect(evalParagraph(paragraph, feedbackItem)).toBeNull();
    });

    test("should return null if not all words were found", () => {
      const paragraph = "<p>aaa bbb ccc ddd eee fff ggg hhh</p>";
      const feedbackItem = {
        "4": {
          alternatives: ["had", "did", "took"],
          idx: 5,
          replacement: "gave",
          text: "made",
          ws: " "
        }
      };
      expect(evalParagraph(paragraph, feedbackItem)).toBeNull();
    });

    test("should return success for single word in feedback, single paragraph", () => {
      const paragraph = "<p class='aa1'>aaa bbb ccc ddd eee fff ggg hhh</p>";
      const feedbackItem = {
        "4": {
          alternatives: [],
          idx: 8,
          replacement: "gave",
          text: "ccc",
          ws: " "
        }
      };
      const expected = {
        "4": {
          alternatives: [],
          idx: 8,
          key: "4",
          length: 3,
          replacement: "gave",
          start: 8,
          text: "ccc",
          ws: " "
        }
      };
      expect(evalParagraph(paragraph, feedbackItem)).toEqual(expected);
    });

    test("should return success for two words in feedback, single paragraph", () => {
      const block = {
        clientId: "22842f83-7f7f-45ca-abb2-cbb77304eaa0",
        name: "core/paragraph",
        isValid: true,
        originalContent: "<p>In 1996, Bill Gates made a bold statement.</p>",
        attributes: {
          content: "In 1996, Bill Gates made a bold statement.",
          dropCap: false
        },
        innerBlocks: []
      };
      const paragraph = getHTMLFromBlock(block, true);
      const feedbackItem = {
        "4": {
          alternatives: ["had", "did", "took"],
          idx: 20,
          replacement: "gave",
          text: "made",
          ws: " "
        },
        "7": {
          alternatives: ["declaration", "proclamation", "message"],
          idx: 32,
          replacement: "speech",
          text: "statement",
          ws: ""
        }
      };
      const expected = {
        "4": {
          alternatives: ["had", "did", "took"],
          idx: 20,
          key: "4",
          length: 4,
          replacement: "gave",
          start: 20,
          text: "made",
          ws: " "
        },
        "7": {
          alternatives: ["declaration", "proclamation", "message"],
          idx: 32,
          key: "7",
          length: 9,
          replacement: "speech",
          start: 32,
          text: "statement",
          ws: ""
        }
      };
      expect(paragraph).toEqual("In 1996, Bill Gates made a bold statement.");
      expect(evalParagraph(paragraph, feedbackItem)).toEqual(expected);
    });
  });

  describe("getFeedbackBlockData()", () => {
    test("should find all with json data", () => {
      // Blocks and feedback are real data taken from https://atomicreach.atlassian.net/browse/AAP-851
      const blocks = require("./blocks.json");
      const feedback = require("./feedback.json");
      const expected = require('./response.json');
      expect(getFeedbackBlockData(feedback, blocks)).toEqual(expected);
    });
  });

  test.todo("evalList");
