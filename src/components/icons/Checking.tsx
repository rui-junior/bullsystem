interface CheckingInterface {
  w?: number;
  h?: number;
  i?: number;
}

export default function Checking({ w = 24, h = 24, i = 1 }: CheckingInterface) {
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
    >
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );
}
