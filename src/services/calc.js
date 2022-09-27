export const calc = ({ curr, prev, operator }) => {
     const currDigit = parseFloat(curr);
     const prevDigit = parseFloat(prev);

     if(isNaN(currDigit) || isNaN(prevDigit)) return "";

     let calculate = "";

     switch (operator) {
          case '+': 
               calculate = prevDigit + currDigit
               break
          case '-': 
               calculate = prevDigit - currDigit
               break
          case '×': 
               calculate = prevDigit * currDigit
               break
          case '÷': 
               calculate = prevDigit / currDigit
               break
          default: 
               calculate = ""
     }

     return calculate.toString();
}