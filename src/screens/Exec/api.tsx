 import { deleteUser } from '../../server/mongodb/actions/User';


 async function deleteData(email: string) {
   const res = await deleteUser(email);
   if (res === null) return false;
   return true;
 }

 
 export { deleteData };