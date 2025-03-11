interface SettingsAlertInterface {
  w?: number;
  h?: number;
  i?: number;
}

export default function SettingsAlert({
  w = 24,
  h = 24,
  i = 1,
}: SettingsAlertInterface) {
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
      // class="icon icon-tabler icons-tabler-outline icon-tabler-settings-exclamation"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15.004 18.401a1.724 1.724 0 0 0 -1.329 1.282c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.079 .262 1.495 1.305 1.248 2.17" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M19 16v3" />
      <path d="M19 22v.01" />
    </svg>
  );
}
