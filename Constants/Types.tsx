export interface userType{
    id: string,
    created_at: Date,
    firstname: string,
    lastname: string,
    birthday: Date,
    gender: string,
    height: number,
    weight: number,
    usertype: string,
    status: boolean,
    address: string,
    email: string,
    to_submit: number,
    contact_number: string
}

export interface submissionType{
    created_at: Date,
    deadline: Date,
    id: string,
    patientid: string,
    status: boolean,
    number: number,
    verified: boolean
}

export interface commentType{
    id: string,
    created_at: Date,
    content: string,
    userid: string,
    submissionid: string

}

export interface agendaType{
    id: string,
    created_at: Date,
    text: string,
    date: Date,
    time: string,
    patientid: string,
    workerid: string,
    confirmed: boolean
}