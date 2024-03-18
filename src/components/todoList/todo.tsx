import React, { useState } from 'react';
import { useTaskList } from '@/store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import editimg from "../images/edit.svg";
import newtask from "../images/newtask.svg";
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,DialogFooter,DialogClose,} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import ss from "../images/ss.svg";
import deleteimg from "../images/delete.svg";
import { close } from 'inspector';
import { useEffect } from 'react';
import axios from 'axios';
import { createNewTask } from '@/helper/utils';


type TaskList = {
    id: number;
    title: string;
    description: string;
    showEdit: boolean;
};

const Todos = (props: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [tasks, setTasks] = useState<Array<{ title: string, desc: string }>>([]);
    const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
    const { updateTask, createdTasks, deleteTask, editTodoTasks, allTask }: any = useTaskList();
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
    const openSheet = () => {
        setIsSheetOpen(true);
        createNewTask(title,desc);
    };
    
    const closeSheet = () => {
        setIsSheetOpen(false);
        setSelectedTaskIndex(0);
        setTitle('');
        setDesc('');
    };
        
    const update = async (id: number) => {
        console.log({id})
        try {
         const resp =   await axios.put(`http://localhost:3001/api/todos/${id}`, { title:title, description: desc });
            // updateTask(title, desc);
            if(resp){
                const finalRes = createdTasks.map((res: TaskList) => {
                    if(res.id === resp.data.id){
                        return {
                            ...resp,
                            id: resp.data.id,
                            title: resp.data.title,
                            description: resp.data.description,
                        }
                    }else
                    {
                        return res
                    }
                })
                allTask(finalRes)
            }
            closeSheet();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    const createTask = async () => {
            createNewTask(title, desc);
            setTitle('');
            setDesc('');
            closeSheet();
    };
    const deleteTaskHandler = async (id: number) => {
        try {
            const resp= await axios.delete(`http://localhost:3001/api/todos/${id}`);
            deleteTask(id)

        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTasks = (index: number) => {
        setSelectedTaskIndex(index);
        setDesc(createdTasks[index].description);
        setTitle(createdTasks[index].title);
    };
   
    console.log({createdTasks})
    return (
        <div>
        {createdTasks.length !== 0 && (
            <>
            <h3 className='pt-5 ml-20 font-bold flex flex-row justify-center items-center'>Created Tasks</h3>
            <p className='ml-20 text-gray-500 flex flex-row justify-center items-center'>{`You have ${createdTasks.length} task${createdTasks.length !== 1 ? 's' : ''} to do`}</p>
            <div className="flex flex-col items-center justify-center ">
                        <Image src={newtask} alt="" onClick={openSheet} width={182} height={10} className="ml-32 self-start flex flew-row hover:bg-rgba-121-136-164-1 " ></Image>
                        {createdTasks.length !== 0 && createdTasks.map((task: TaskList, index: number) => ( 
                            <div key={index} className='mt-5 bg-[rgba(245,247,249,1)] bg-opacity-100 flex flex-col justify-center items-center w-3/4 h-28 rounded-2xl relative'>
                            {task.showEdit && (
                                    <>
                                        {/* Delete */}
                                        <Dialog>
                                            <DialogTrigger>
                                                <Image src={editimg} alt="" onClick={() => { editTasks(index) }} width={28} height={28} className="absolute top-10 right-12 cursor-pointer"></Image>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit profile</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your profile here. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="title" className="text-right">
                                                            Title
                                                        </Label>
                                                        <Input id="title" value={title} className="col-span-3" onChange={(e) => { setTitle(e.target.value) }}  />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="desc" className="text-right">
                                                            Description
                                                        </Label>
                                                        <Input id="desc" value={desc} className="col-span-3" onChange={(e) => { setDesc(e.target.value) }} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" onClick={() => {
                                                        console.log({task})
                                                        update(task.id)}}>Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Image src={deleteimg} alt="" onClick={() => { deleteTaskHandler(task.id) }} width={28} height={28} className="absolute top-10 right-3 cursor-pointer"></Image>
                                        {/* Edit */}
                                    </>
                                )}
                                <div className='absolute flex flex-row justify-start self-start left-5 top-8'>
                                    <div className="">
                                        <Checkbox id={`checkbox-${index}`} checked={task.showEdit} onCheckedChange={() => {
                                            editTodoTasks(task.id, task.title, task.description, !task.showEdit)
                                            setIsCheckboxChecked(!isCheckboxChecked);
                                        }} />
                                        <Label htmlFor={`checkbox-${index}`}></Label>
                                    </div>
                                </div>
                                <div className='absolute left-20'>
                                    <p className=' flex flex-row justify-center items-start font-bold '>{task.title}</p>
                                    <p className=' pl-3 flex flex-row justify-center items-start text-rgba-141-156-184-1'>{task.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <Sheet open={isSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            <h2>Create Task</h2>
                            <h3 className="p-4 font=['Urbanist'] text-sm font-medium leading-17 tracking-normal text-left text-indigo-800 w-27 h-17">Title</h3>
                            <Input type="text" placeholder="Enter text.. " onChange={(e) => { setTitle(e.target.value) }} />
                            <h3 className=" mt-3 font=['Urbanist'] text-sm font-medium leading-17 tracking-normal text-left text-indigo-800 w-27 h-17">Description</h3>
                            <Input type="text" placeholder="Enter Description.." className="w-96 h-56" onChange={(e) => { setDesc(e.target.value) }} />
                        </SheetTitle>
                        <SheetDescription>
                            <div>
                                <h3 className=" mt-3 font=['Urbanist'] text-sm font-medium leading-17 tracking-normal text-left text-indigo-800 w-27 h-17">Upload Screenshot</h3>
                                <div className="w-32 h-32  rounded-md border-dotted border-1 border-black flex flex-row items-center justify-center">
                                    <Image src={ss} width={20} height={20} alt=""></Image>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between align-center pt-8 w-full">
                                <Button variant="outline" className="w-[45%] h-12 font=['Urbanist'] p-5  rounded-12 border-1 border-solid  border-black gap-3 flex flex-row justify-center items-center " onClick={closeSheet}>Cancel</Button>
                                <Button variant="outline" className="w-[45%] h-12 font=['Urbanist']  p-5 rounded-12 border-1 border-solid border-black gap-3 flex flex-row justify-center items-center bg-blue-500 bg-opacity-10 text-blue-600" onClick={() =>{
                                    createTask()
                                }} >+ Create Task</Button>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default Todos;

