interface PlansInterface {
  w?: number;
  h?: number;
  i?: number;
}

export default function Plans({
  w = 24,
  h = 24,
  i = 1,
}: PlansInterface) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={i}
      stroke-linecap="round"
      stroke-linejoin="round"
      // class="icon icon-tabler icons-tabler-outline icon-tabler-file-analytics"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 17l0 -5" />
      <path d="M12 17l0 -1" />
      <path d="M15 17l0 -3" />
    </svg>
  );
}
