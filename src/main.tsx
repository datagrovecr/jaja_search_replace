import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "prosemirror-image-plugin/dist/styles/common.css";
import "prosemirror-image-plugin/dist/styles/withResize.css";
import "prosemirror-image-plugin/dist/styles/sideResize.css";
import {lintPlugin, searchCommand} from './lint'

import {MenuItem} from "prosemirror-menu"
import {buildMenuItems} from "prosemirror-example-setup"
import {dinoMenu,dinoSchema} from "./dinosExample"

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
import { EditorState, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser, Fragment, Node, NodeType, Slice } from "prosemirror-model"
import { Transform } from 'prosemirror-transform';
import { exampleSetup } from "prosemirror-example-setup"
import { initialDoc } from "./schema"
//import {CodeBlockView,arrowHandlers} from "./codemirror"
import { defaultSettings, imagePlugin } from "prosemirror-image-plugin"


const sch = dinoSchema
const doc =  {
  type: "doc",
  content: [
    {
      content: [
        {
          text: "Start typing! in my dreams I know prose mirror",
          type: "text",
        },
      ],
      type: "paragraph",
    },
  ]
}


let editor = document.querySelector("#editor")!
let content = document.querySelector("#content")!
let view = new EditorView(editor, {
  state: EditorState.create({
    doc: sch.nodeFromJSON(doc),
    plugins: [
      ...exampleSetup({ 
        schema: sch,
        menuContent: dinoMenu
       }),
      //.concat(arrowHandlers),
      imagePlugin(sch, { ...defaultSettings }),
      lintPlugin(),
    ]
  }),
 // nodeViews: {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}
})


let search = document.querySelector('#search') as HTMLInputElement;
let replace = document.querySelector('#replace') as HTMLInputElement;

document.getElementById('search')?.addEventListener('input', () => {
  console.log(search.value)
    if (search.value) {
      searchCommand(search.value)(view.state, view.dispatch, view)
    }
})

/*

    let state = EditorState.create({
      doc: DOMParser.fromSchema(dinoSchema).parse(content),
      plugins: [
        ...exampleSetup({ 
          schema: sch,
          menuContent: dinoMenu
         }),
        //.concat(arrowHandlers),
        imagePlugin(sch, { ...defaultSettings }),
        lintPlugin,
        searchReplacePlugin2
      ]
    })
  
    let view = new EditorView(document.body, {
    state,
    dispatchTransaction(transaction) {
      console.log("Document size went from", transaction.before.content.size,
                  "to", transaction.doc.content.size)
      let newState = view.state.apply(transaction)
      view.updateState(newState)
    }
  })
}
)
*/

/*
document.getElementById('search')?.addEventListener('change', () => {
  return function(state:EditorState, dispatch: (tr: Transaction) => void){
    if (dispatch)
    dispatch(state.tr.scrollIntoView())
}})
*/