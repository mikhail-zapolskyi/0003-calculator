import { Box, Grid, Button, Typography } from "@mui/material";
import { useReducer } from 'react';
import { digits, ops } from "./components/symbols";
import { ACTIONS } from "./actions/actions";
import { calc } from "./services/calc";

const reducer = (state, {type, payload}) => {
     // eslint-disable-next-line
     switch(type){
          case ACTIONS.ADD_DIGIT:

               if (state.overwrite) {
                    return {
                      ...state,
                      curr: payload.digit,
                      overwrite: false,
                    }
               }

               // returns state if payload and current state 0
               if(payload.digit === '0' && state.curr === '0' ) {
                    return state
               }

               // returns 0. if payload . and current state undifined or 0
               if(payload.digit === '.' && !state.curr) {
                    return {...state, curr: `0.`}
               }

               // returns state if payload is . and current state already includes . 
               if (payload.digit === "." && state.curr?.includes(".")) {
                    return state
               }

               if(isNaN(state.curr)){
                    // if current state is - oparator and state operator present
                    if(state.curr === '-' && payload.digit){
                         return {
                              ...state,
                              curr: state.curr + payload.digit
                         }
                    }

                    return {
                         ...state,
                         curr: payload.digit
                    }
               }

               return {
                    ...state,
                    curr: `${state.curr || ''}${payload.digit}`
               }

          case ACTIONS.OPERATION:
               // if curr and prev states are null or undefined return state
               if (state.curr == null && state.prev == null) {
                    return state
               }

               if(payload.operator !== '-') {
                    // if curr state is null (operator present) it returns new operator
                    if(state.curr == null){
                         return {
                              ...state,
                              operator: payload.operator
                         }
                    }
     
                    if(state.prev == null){
                         return {
                              ...state,
                              operator: payload.operator,
                              prev: state.curr,
                              curr: null
                         }
                    }
     
               } else {
                    if(state.curr == null && payload.digit){
                         return {
                              ...state,
                              curr: state.curr + payload.digit
                         }
                    }

                    if(state.prev == null){
                         return {
                              ...state,
                              operator: payload.operator,
                              prev: state.curr,
                              curr: null
                         }
                    }
                    // if state.curr any of operators
                    if(state.curr == null){
                         if(state.operator){
                              return {
                                   ...state,
                                   curr: payload.operator
                              }
                         }
                         return {
                              ...state,
                              operator: state.curr,
                              prev: state.prev,
                              curr: payload.operator
                         }
                    }
               }
               // if current state is operator and operator state is minus
               if(isNaN(state.curr)){
                    // if payload is operator return new operator and clean current state
                    if(payload.operator){
                         return {
                              ...state,
                              operator: payload.operator,
                              curr: null
                         }
                    }
               }

               return {
                    ...state,
                    prev: calc(state),
                    operator: payload.operator,
                    curr: null
               }

          case ACTIONS.CLEAR:
               return {}

          case ACTIONS.EQUALS:

               if(state.curr == null || state.prev == null || state.operator == null){
                    return state
               }     

               return {
                    ...state,
                    overwrite: true,
                    curr: calc(state),
                    prev: null,
                    operator: null
               }

          case ACTIONS.DELETE_DIGIT:
               if (state.overwrite) {
                    return {
                      ...state,
                      overwrite: false,
                      curr: null,
                    }
               }
                  if (state.curr == null) return state
                  if (state.curr.length === 1) {
                    return { ...state, curr: null }
               }
            
               return {
                    ...state,
                    curr: state.curr.slice(0, -1),
               }

          case ACTIONS.PERCENT:
               return {
                    ...state,
                    curr: (state.curr / 100) * state.prev
               }
          case ACTIONS.SQUERE:
               return {
                    ...state,
                    overwrite: true,
                    curr: Math.sqrt(state.curr)
               }
     }
};

const App = () => {
     const [{curr = '0', prev, operator}, dispatch] = useReducer(reducer, {});
    
     const handleButtons = (value) => {
          if(value === 'AC'){
               dispatch({ type: ACTIONS.CLEAR })
          };

          if(value === '√') {
               dispatch({ type: ACTIONS.SQUERE })
          }

          if(value === '%') {
               const operator = '%';
               dispatch({ type: ACTIONS.PERCENT, payload: { operator }})
          }

     };

     return (
          <Box display='flex' width='100vw' height='100vh'>
               <Box m='auto' width={320} minWidth={320} height={500} bgcolor='darkgray' borderRadius={1} p={.3}>
                    <Grid container rows={{ xs: 2, md: 2 }}>
                         <Grid item container xs={12} rows={{ xs: 2}} height={100} bgcolor="black">
                              <Grid item container xs={12} justifyContent='end' p={1} borderRadius={.5}>
                                   <Typography color='orange'>{prev} {operator} {curr}</Typography>
                              </Grid>
                              <Grid item container xs={12} justifyContent='end' p={1}>
                                   <Typography color='orange' fontSize={30} id='display'>{ Number.parseFloat(curr).toFixed(4) }</Typography>
                              </Grid>
                         </Grid>
                         <Grid item container xs={12} height={400}>
                              <Grid item xs={9} rows={2}>
                                   <Grid item container xs={12} justifyContent='center'>
                                        { ops[1].map(action => 
                                             <Grid item xs={4}justifyContent='center' alignItems='center' p={0.1} key={action.id}>
                                                  <Button 
                                                       sx={{ 
                                                            height: 77,
                                                            width: '100%',
                                                            color: 'white',
                                                            fontSize: 25,
                                                            bgcolor: 'orange',
                                                       }}
                                                       id={action.id}
                                                       onClick={() => handleButtons(action.el)}
                                                  >{action.el}</Button> 
                                             </Grid>    
                                        )}
                                   </Grid>
                                   <Grid item container xs={12} justifyContent='center'>
                                        { digits.map(number => 
                                             { 
                                                  const {digit, id} = number;
                                                  return (
                                                  <Grid item xs={4} justifyContent='center' alignItems='center' p={0.1} key={id}>
                                                       <Button 
                                                            sx={{ 
                                                                 height: 77,
                                                                 width: '100%',
                                                                 color: 'white',
                                                                 fontSize: 25,
                                                                 bgcolor: 'gray',
                                                            }}
                                                            id={id}
                                                            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
                                                       >{digit}</Button> 
                                                  </Grid>
                                             )}
                                        )}
                                        <Grid item xs={4}justifyContent='center' alignItems='center' p={0.1} >
                                             <Button 
                                                  sx={{ 
                                                       height: 77,
                                                       width: '100%',
                                                       color: 'white',
                                                       fontSize: 25,
                                                       bgcolor: 'orange',
                                                  }}
                                                  id='delete'
                                                  onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}
                                             >DEL</Button> 
                                        </Grid>
                                   </Grid>
                              </Grid>
                              <Grid item xs={3} height='100%'>
                                   { ops[0].map(ops => {
                                             const {operator, id} = ops;
                                             return (
                                                  <Grid item justifyContent='center' alignItems='center' p={0.1} key={id}>
                                                       <Button 
                                                            sx={{ 
                                                                 height: 77,
                                                                 width: '100%',
                                                                 color: 'white',
                                                                 fontSize: 25,
                                                                 bgcolor: 'orange'
                                                            }}
                                                            id={id}
                                                            onClick={() => dispatch({ type: ACTIONS.OPERATION, payload: { operator } })}
                                                       >{operator}</Button> 
                                                  </Grid>    
                                             )
                                        }
                                   )}
                                   <Grid item justifyContent='center' alignItems='center' p={0.1}>
                                        <Button 
                                             sx={{ 
                                                  height: 77,
                                                  width: '100%',
                                                  color: 'white',
                                                  fontSize: 25,
                                                  bgcolor: 'orange'
                                             }}
                                             id='equals'
                                             onClick={() => dispatch({ type: ACTIONS.EQUALS })}
                                        >=</Button> 
                                   </Grid>    
                              </Grid>
                         </Grid>
                    </Grid>
               </Box>
          </Box>
     )
}

export default App