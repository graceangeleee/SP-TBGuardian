import { supabase } from "./supabase";


export async function getMissing(userid:string){
    const date = new Date().toISOString();
    try{
        if(userid === null || userid === ""){
            return ({status: false, message: "No user logged in"})
        }else{
            const {data, error, status} = await supabase
            .from('submissions')
            .select()
            .eq("patientid", userid)
            .eq("status", "FALSE")
            .lt("deadline", date)

            if(error && status !==406){
                throw error
            }

            if(data){
                return ({status: true, data: data})
            }
        }
    }catch(error){
        if(error instanceof Error){
            return({status: false, message: error.message})
        }
    }finally{
        return
    }
}