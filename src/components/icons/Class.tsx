
interface ClassIconsProps {
        w?: number;
        h?: number;
}


export default function Class({ w = 24, h = 24 }: ClassIconsProps) {

        return(

                <svg  xmlns="http://www.w3.org/2000/svg"  width={w}  height={h}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>


        )




}