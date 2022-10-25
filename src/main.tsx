import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"


// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});
let editor = document.querySelector("#editor")!
let content = document.querySelector("#content")!
let view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  })
})
//Replace
let search = document.querySelector('#search') as HTMLInputElement;
let replace = document.querySelector('#replace') as HTMLInputElement;
document.getElementById('go')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  content.innerHTML = s.replaceAll(search.value, replace.value)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})

//Find and highlight function 
/*
let find = document.querySelector("#find") as HTMLInputElement;
document.getElementById('go2')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  if (s.includes(find.value)){
    content.innerHTML = find.value //+ add highlight 
  }
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
*/

//new find to test
let find = document.querySelector('#find') as HTMLInputElement;
let nuevo = "";
document.getElementById('go2')?.addEventListener('click', () => {
  let s = editor.querySelector(".ProseMirror")!.innerHTML
  if(s.includes(find.value)){
    nuevo = find.value
    //nuevo = nuevo.bold() // bold
    nuevo = nuevo.toUpperCase() //sets found word to upper case 
  }
  content.innerHTML = s.replaceAll(find.value, nuevo)
  view.updateState(EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(content),
    plugins: exampleSetup({ schema: mySchema })
  }))
})
 
//prosemirror linting
//import {Decoration, DecorationSet} from "prosemirror-view"

// function lintDeco(document) {
//   let decorations = []
//   lint(document).forEach(prob => {
//     decorations.push(Decoration.inline(prob.from, prob.to, {class: "problem"}),
//                Decoration.widget(prob.from, lintIcon(prob)))
//   })
//   return DecorationSet.create(document, decorations)
// }

//linter code
// lint{
// Words you probably shouldn't use
const badWords = /\b(obviously|clearly|evidently|simply)\b/ig
// Matches punctuation with a space before it
const badPunc = / ([,\.!?:]) ?/g

function lint(document: Node) {
  let result = [], lastHeadLevel = null

  function record(msg, from, to, fix) {
    result.push({msg, from, to, fix})
  }

  // For each node in the document
  document.descendants((node, pos) => {
    if (node.isText) {
      // Scan text nodes for suspicious patterns
      let m
      while (m = badWords.exec(node.text))
        record(`Try not to say '${m[0]}'`,
               pos + m.index, pos + m.index + m[0].length)
      while (m = badPunc.exec(node.text))
        record("Suspicious spacing around punctuation",
               pos + m.index, pos + m.index + m[0].length,
               fixPunc(m[1] + " "))
    } else if (node.type.name == "heading") {
      // Check whether heading levels fit under the current level
      let level = node.attrs.level
      if (lastHeadLevel != null && level > lastHeadLevel + 1)
        record(`Heading too small (${level} under ${lastHeadLevel})`,
               pos + 1, pos + 1 + node.content.size,
               fixHeader(lastHeadLevel + 1))
      lastHeadLevel = level
    } else if (node.type.name == "image" && !node.attrs.alt) {
      // Ensure images have alt text
      record("Image without alt text", pos, pos + 1, addAlt)
    }
  })

  return result
}
// }

// fix{
function fixPunc(replacement) {
  return function({state, dispatch}) {
    dispatch(state.tr.replaceWith(this.from, this.to,
                                  state.schema.text(replacement)))
  }
}

function fixHeader(level) {
  return function({state, dispatch}) {
    dispatch(state.tr.setNodeMarkup(this.from - 1, null, {level}))
  }
}

function addAlt({state, dispatch}) {
  let alt = prompt("Alt text", "")
  if (alt) {
    let attrs = Object.assign({}, state.doc.nodeAt(this.from).attrs, {alt})
    dispatch(state.tr.setNodeMarkup(this.from, null, attrs))
  }
}
// }

// deco{
import {Decoration, DecorationSet} from "prosemirror-view"

function lintDeco(doc) {
  let decos = []
  lint(doc).forEach(prob => {
    decos.push(Decoration.inline(prob.from, prob.to, {class: "problem"}),
               Decoration.widget(prob.from, lintIcon(prob)))
  })
  return DecorationSet.create(doc, decos)
}

function lintIcon(prob) {
  let icon = document.createElement("div")
  icon.className = "lint-icon"
  icon.title = prob.msg
  icon.problem = prob
  return icon
}
// }

// plugin{
import {Plugin, TextSelection} from "prosemirror-state"

let lintPlugin = new Plugin({
  state: {
    init(_, {doc}) { return lintDeco(doc) },
    apply(tr, old) { return tr.docChanged ? lintDeco(tr.doc) : old }
  },
  props: {
    decorations(state) { return this.getState(state) },
    handleClick(view, _, event) {
      if (/lint-icon/.test(event.target.className)) {
        let {from, to} = event.target.problem
        view.dispatch(
          view.state.tr
            .setSelection(TextSelection.create(view.state.doc, from, to))
            .scrollIntoView())
        return true
      }
    },
    handleDoubleClick(view, _, event) {
      if (/lint-icon/.test(event.target.className)) {
        let prob = event.target.problem
        if (prob.fix) {
          prob.fix(view)
          view.focus()
          return true
        }
      }
    }
  }
})
// }

// editor{


let state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
  plugins: exampleSetup({schema}).concat(lintPlugin)
})

window.view = new EditorView(document.querySelector("#editor"), {state})
// }