interface HamburguerInterface {
  w?: number;
  h?: number;
  i?: number;
}

export default function Hamburguer({
  w = 24,
  h = 24,
  i = 1,
}: HamburguerInterface) {
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
      // class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </svg>
  );
}
