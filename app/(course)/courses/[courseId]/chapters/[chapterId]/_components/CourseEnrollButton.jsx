"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

export default function CourseEnrollButton({price,courseId,}) {
 
    const [isLoading, setIsLoading] = useState(false);
 
    async function onClick(){
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url);
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }
    }

    return (
    <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
    >
        Enroll for : {price} د.ت
    </Button>
  )
}
