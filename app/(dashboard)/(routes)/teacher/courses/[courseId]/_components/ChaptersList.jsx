"use client";

import { Chapter } from "@/models/chapter";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"; 
import { cn } from "@/lib/utils";
import {  Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChaptersList({ items, onReorder, onEdit,chap }) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(chap);
  // we use useefffect to prevent the hidration problem when moutin the clien componant in the server side page
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    setChapters(chap);
  }, [chap]);

  console.log(items);
  console.log("chap:",chap);
  if (!isMounted) {
    return null;
  }

  function onDragEnd(result){
    if(!result.destination) return ;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);
    console.log("items :",items)

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter._id,
      position: items.findIndex((item) => item._id === chapter._id)
    }));
    console.log("bulkUpdateData : ",bulkUpdateData)
    
    console.log("chapters : ",chapters)
    
    onReorder(bulkUpdateData);
  }


  return (
    <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="chapters" >
          {(provided)=>(
            <div 
            {...provided.draggableProps}
            ref={provided.innerRef}     
            >
              {chapters.map((chapter,index)=> (
                <Draggable
                key={chapter._id}
                draggableId={chapter._id}
                index={index}
                >
                  {(provided)=>(
                    <div className={cn(
                      "`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm",
                      chapter.isPublished && "bg-blue-100 border-blue-200 text-blue-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                    >
                      <div className={cn(
                        " flex gap-x-3 px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition",
                        chapter.isPublished && "border-r-blue-200 hover:bg-blue-200"
                      )}
                      {...provided.dragHandleProps} 
                      >
                        <span className="flex gap-x-3">
                          <Grip
                            className=" text-sky-700 h-5 w-5 "
                            />
                            {chapter.title}
                        </span>
                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                          {chapter.isFree &&(
                            <Badge>
                              Free
                            </Badge>
                            
                          )}
                          <Badge
                            className={cn(
                              "bg-slate-500",
                              chapter.isPublished && "bg-sky-700"
                            )}
                          >
                          {chapter.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Pencil
                            onClick={() => onEdit(chapter._id)}
                            className="w-4 h-4 cursor-pointer hover:opacity-75 hover:text-sky-700   transition"
                          />
                        </div>
  
                      </div>  
                    </div>
                  )}

                </Draggable>
              ))}
              
              {provided.placeholder}

            </div>
          )}
        </Droppable>
    </DragDropContext>
  );
}
