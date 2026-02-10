import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, reset } from "../../features/counter/counterSlice";
    

const Counter = () =>{
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch();

    return(
        <div className="w-full h-full bg-blue-100">
           <h3> Counter Application</h3>
           <p>Count : {count}</p>
           <div className="flex justify-center items-center" >
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
           </div>
        </div>
        
    )
}

export default Counter;