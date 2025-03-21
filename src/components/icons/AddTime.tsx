interface ClassIconsProps {
  w?: number;
  h?: number;
  f?: number;
}

export default function AddTime({ w = 24, h = 24, f = 2 }: ClassIconsProps) {
  return (
    <svg
      // xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={f}
      stroke-linecap="round"
      stroke-linejoin="round"
      // class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
      <path d="M16 19h6" />
      <path d="M19 16v6" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
