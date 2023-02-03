// export const catchAsyncError = ()=>{
//     return {

//     }
// }
// above function and below function meaning is same but the syntax is different
// export const catchAsyncError = (passedFunction) => (req, res, next) => {
//     // passed function is equalls to jinchuriki block which is present in coursecontroller file

//     // below thing is whenever error will be there catch anonymous function is automatically run
//     // Promise.resolve(passedFunction(req,res,next)).catch(()=>{

//     // });
//     Promise.resolve(passedFunction(req, res, next)).catch(next); // here next word mean is just pass the request to the next handler if there otherwise just catch the error
// }
export const catchAsyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
  };
  