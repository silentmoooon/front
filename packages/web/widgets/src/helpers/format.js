import round from './round'

export default (input)=>{

  let float = round(input)
  let floatToString = float.toString()

  if(new RegExp(/\./).test(floatToString)) {
    let exploded = floatToString.split('.')
    return(
      new Intl.NumberFormat().format(parseInt(exploded[0]))
      +'.'+
      exploded[1]
    )
  } else {
    return(
      new Intl.NumberFormat().format(float)
    )
  }
}
