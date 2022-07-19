function pad(num:number, length:number) {
    var str = '' + num;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
}

export const dateFormatter = (date:Date) => {
    return `${date.getFullYear()}${pad((1 + date.getMonth()), 2)}${pad(date.getDate(), 2)}`;
}

export const timeFormatter = (date:Date) => {
    return `${pad((date.getHours()), 2)}${pad(date.getMinutes(), 2)}`;
}

