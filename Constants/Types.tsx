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
    workerid: string,
    treatment_regimen: string,
    disease_class: string,
    registration_group: string,
    date_started: Date,
    total: number
}

export interface submissionType{
    created_at: Date,
    deadline: string,
    id: string,
    patientid: string,
    status: boolean,
    number: number,
    verified: boolean,
    videopath: string,
    missing_reminder: boolean,
    deadline_reminder: boolean,
    date_submitted: Date,
    video_taken: Date,
    workerid: string
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
    date: string,
    time: string,
    patientid: string,
    workerid: string,
    confirmed: boolean
}