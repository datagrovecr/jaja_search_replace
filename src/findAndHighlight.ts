import { EditorState,Transaction, Plugin, TextSelection} from "prosemirror-state"
import {Decoration, DecorationSet} from "prosemirror-view"
import { Node } from "prosemirror-model"
import { newFind } from "./main"

interface Dispatch {
    state: EditorState,
    dispatch: (e: Transaction) => void
  }
  
  interface Problem extends HTMLElement {
    ["data-problem"]?: Result 
  }
  interface Result {
    from: number, to: number, fix?: (props: Dispatch)=>void
  }
  const find = document.querySelector('#search') as HTMLInputElement;
  let findStr: string
  //find and highlight 
  function findHighlight(doc: Node) : Result[] {
    let result: Result[] = []
    if (!findStr) return result
    // For each node in the document
    doc.descendants((node: Node, pos: number, parent: Node | null) => {
      if (node.isText) {
        let text = node.text!
        let index = 0
        while (index!=-1) {
          index = text.indexOf(findStr,index)
          if (index != -1) {
            const from = pos + index
            const to = pos + index + findStr.length
            result.push({ from, to })
            //console.log(from,to, node.text)
            index += findStr.length
          }
        }
      }
    })
    return result
}
function searchDeco(doc: Node) { //helps with highlight
    let decos : Decoration[] = []
    findHighlight(doc).forEach(prob => {
      decos.push(Decoration.inline(prob.from, prob.to, {class: "problem"}),
                 Decoration.widget(prob.from, searchIcon(prob)))
    })
    return DecorationSet.create(doc, decos)
  }
  function searchIcon( prob: Result) { //search icon
    let icon = document.createElement("div") as Problem
    icon.className = "search-icon"
    //icon.title = prob.msg;
    icon["data-problem"] = prob
    return icon
  }

