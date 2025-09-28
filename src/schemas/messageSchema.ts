 
  import {z} from 'zod'
  
  export const messageSchema = z.object({
      content : z
      .string()
      .min(10,{message : "content must be at least of 10 characters"})
      .max(500,{message : "content must be no longer than 500 characters"})

  })
  