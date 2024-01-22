  export const AccountFetchSchema = {
    type:"object",
    required : ['id'],
    properties:{
        id : {type : "number"},
    }
  }

  export const AccountSearchSchema = {
    type:"object",
    properties:{
        id : {type : "number"},
        name : {type : "string"},
        search_key : {type : "string"}
    }
  }

  export const AccountCreationSchema = {
      type:"object",
      required : ['name'],
      properties:{
          name : {type : "string"},
      }
  }

  export const AccountUpdateSchema = {
    type:"object",
    required : ['id'],
    properties:{
        id : {type : "number"},
        name : {type : 'string'}
    }
  }

  export const AccountActivationSchema = {
    type:"object",
    required : ['id','active'],
    properties:{
        id : {type : "number"},
        active : {type : 'boolean'}
    }
  }