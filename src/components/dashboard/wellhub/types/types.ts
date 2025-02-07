export interface ClassData {
  id: number;
  gym_id: number;
  product_id: number;
  visible: boolean;
  bookable: boolean;
  name: string;
  description: string;
  created_at: string;
  slots?: any
}

export interface Slots {
  id?: number;
  class_id?: number;
  occur_date?: string;
  status?: number;
  room?: string;
  length_in_minutes?: number;
  total_capacity?: number;
  total_booked?: number;
  product_id?: number;
  booking_window?: {
    opens_at: string;
    closes_at: string;
  };
  cancellable_until?: string;
  instructors?: Instructor[];
  virtual?: boolean;

}

interface Instructor {
  name?: string;
  substitute?: boolean;
}

interface BookingWindow {
  opens_at: string;
  closes_at: string;
}

export type NewClassProps = {
  onCancel: () => void;
};

export interface ModalEditSlotsInterface {
  item: Slots;
  onCancel: () => void;
}

export interface ModalNewSlostInterface {
  item: ClassData;
  onCancel: () => void;
}
