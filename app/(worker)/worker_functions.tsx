
async function getMonitoring(){
    setLoading(true)
     try{
         const { data, error, status } = await supabase
         .from('users')
         .select()
         .eq("status", "FALSE")

         if(error && status !== 406){
             throw error;
         }
 
         if(data){
             setMonitoring(data);
         }
     }catch (error){
         if(error instanceof Error){
             Alert.alert(error.message)
         }
     }finally{
         setLoading(false)
     }
 }

async function getDone(){
    setLoading(true)
    try{
        const { data, error, status } = await supabase
        .from('users')
        .select()
        .eq("status", "TRUE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setDone(data);
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getMissing(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "FALSE")
        .lt("deadline", date)

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setMissing(data);
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getVerified(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "TRUE")
        .eq("verified", "FALSE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setVerified(data) 
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}

async function getUnverified(){
    setLoading(true)
    const date = new Date().toISOString();

    try{
        const { data, error, status } = await supabase
        .from('submissions')
        .select()
        .eq("status", "TRUE")
        .eq("verified", "TRUE")

        if(error && status !== 406){
            throw error;
        }

        if(data){
            setUnverified(data) 
        }
    }catch (error){
        if(error instanceof Error){
            Alert.alert(error.message)
        }
    }finally{
        setLoading(false)
    }
}
