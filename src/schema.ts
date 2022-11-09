

import { schema } from "prosemirror-schema-basic"
import OrderedMap from "orderedmap";

 // Ugly hack for checking schema spec type..
if (!(schema.spec.nodes instanceof OrderedMap))
throw new Error("Incorrect schema type");

export var initialDoc = {
  content: [
  {
    content: [
      {
        text: "This is a sample hello, where I'm going to test hello if certain words are hello changed to bold",
        type: "text",
      },
    ],
    type: "paragraph",
  },
  {
    content: [
      {
        text: `function max(a, b) {
          return a > b ? a : b
        }`,
        type: "text",
      },
    ],
    type: "code_block",
  },
  {
    type: "image",
    attrs: {
      src: "data:image/png;base64,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",
      alt: "Image",
      align: "center",
    },
  },
],
type: "doc",
};

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
/*
export const mySchema = new Schema({
  nodes:{ 
    image: updateImageNode(schema.spec.nodes, {
    ...imageSettings,
  }),
    dinos: schema.spec.nodes.addBefore("image", "dino", dinoNodeSpec),
},
  marks: schema.spec.marks,
});
*/

