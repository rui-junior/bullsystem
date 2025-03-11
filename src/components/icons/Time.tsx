interface ClassIconsProps {
  w?: number;
  h?: number;
}

export default function Time({ w = 24, h = 24 }: ClassIconsProps) {
  return (
    <svg
//       xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
//       class="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-3"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12h3.5" />
      <path d="M12 7v5" />
    </svg>
  );
}
