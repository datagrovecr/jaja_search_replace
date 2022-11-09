import { EditorState,Transaction, Plugin, TextSelection} from "prosemirror-state"
import { EditorView,Decoration, DecorationSet } from "prosemirror-view"
import { DOMParser, Schema } from "prosemirror-model"
import { exampleSetup } from "prosemirror-example-setup"
import { dinoSchema, dinoMenu } from "./dinosExample"
import { sch, doc } from "./main"
import { lintPlugin } from './lint';
import './index.css'
import { defaultSettings, updateImageNode, imagePlugin } from "prosemirror-image-plugin"
//variables
let search = document.querySelector('#search') as HTMLInputElement;
let replace = document.querySelector('#replace') as HTMLInputElement;
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
      imagePlugin(sch, { ...defaultSettings }),
      lintPlugin,
      
    ]
  }),
 // nodeViews: {code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos)}
})




export function newFind (doc : Node) {

  let nuevo = "";
  document.getElementById('go')?.addEventListener('click', () => {
    let s = editor.querySelector(".ProseMirror")!.innerHTML
    if(s.includes(search.value)){
      nuevo = search.value
      nuevo = nuevo.bold() // bold
      //nuevo = nuevo.toUpperCase() //sets found word to upper case 
      
    }
    content.innerHTML = s.replaceAll(search.value, nuevo)
    view.updateState(EditorState.create({
      doc: DOMParser.fromSchema(dinoSchema).parse(content),
      plugins: exampleSetup({schema: dinoSchema})
    }))
  })
  }




export function findReplace (){
    document.getElementById('go')?.addEventListener('click', () => {
        let s = editor.querySelector(".ProseMirror")!.innerHTML
        content.innerHTML = s.replaceAll(search.value, replace.value)
        view.updateState(EditorState.create({
          doc: DOMParser.fromSchema(dinoSchema).parse(content),
          plugins: exampleSetup({ schema: dinoSchema })
        }))
      })
    
    }    

 
