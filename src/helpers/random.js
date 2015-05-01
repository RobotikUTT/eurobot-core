/**
 * Return a number integer between start and end included
 * @param  {Int} start Min
 * @param  {Int} end Max
 * @return {Int}      Random number start <== return <= end
 */

export default function randRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}