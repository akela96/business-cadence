import { forwardRef, memo, useRef } from "react";
import Draggable, {
  ControlPosition,
  DraggableBounds,
  DraggableData,
  DraggableEvent,
} from "react-draggable";
import { months } from "../../months.ts";
import { DragHandle } from "../dragHandle/dragHandle.tsx";

interface Props {
  leftPosition: ControlPosition;
  rightPosition: ControlPosition;
  leftBound: DraggableBounds;
  rightBound: DraggableBounds;
  containerWidth: number;
  days: number;
  handleDragLeft: (_: DraggableEvent, data: DraggableData) => void;
  handleDragRight: (_: DraggableEvent, data: DraggableData) => void;
  handleStopLeft: () => void;
  handleStopRight: () => void;
  setIsLeftDragging: (value: boolean) => void;
  setIsRightDragging: (value: boolean) => void;
  isLeftDragging: boolean;
  isRightDragging: boolean;
  startMonthData: null | { name: string; dayOfMonth: number };
  endMonthData: null | { name: string; dayOfMonth: number };
  dragWidth: number;
  startMonth: number;
  endMonth: number;
  weeksBetweenDates: { start: number; end: number }[];
  getDayAndMonth: (dayOfYear: number) => number;
  leftDay: number;
  rightDay: number;
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  isDragging: boolean;
  today: number;
}

const DatePickerComponent = forwardRef<HTMLDivElement, Props>(
  function (props, ref) {
    const {
      leftPosition,
      leftBound,
      containerWidth,
      days,
      handleDragLeft,
      handleStopLeft,
      setIsLeftDragging,
      isLeftDragging,
      startMonthData,
      dragWidth,
      rightBound,
      rightPosition,
      handleDragRight,
      handleStopRight,
      setIsRightDragging,
      isRightDragging,
      endMonthData,
      startMonth,
      endMonth,
      weeksBetweenDates,
      getDayAndMonth,
      leftDay,
      rightDay,
      activeIndex,
      onMouseEnter,
      onMouseLeave,
      isDragging,
      today,
    } = props;

    const leftDragRef = useRef(null);
    const rightDragRef = useRef(null);

    const monthsSlice = months.slice(startMonth, endMonth + 1);

    return (
      <div className={"flex flex-col grow border-b border-[#828282]"}>
        <div className={"flex flex-col grow relative"} ref={ref}>
          <div
            className={"absolute left-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"}
            style={{ width: leftPosition.x }}
          />

          <Draggable
            nodeRef={leftDragRef}
            axis={"x"}
            bounds={leftBound}
            position={leftPosition}
            grid={[containerWidth / days, 0]}
            onDrag={handleDragLeft}
            onStop={handleStopLeft}
            onMouseDown={() => setIsLeftDragging(true)}
          >
            <DragHandle
              ref={leftDragRef}
              isDragging={isLeftDragging}
              day={(startMonthData?.dayOfMonth ?? 0) + 1}
              dragWidth={dragWidth}
            />
          </Draggable>

          <div className={"flex grow border-b border-[#828282]"}>
            {months.map((month) => (
              <div
                key={month.name}
                className={"flex-1 flex flex-col"}
                style={{ flexGrow: month.days }}
              >
                <div
                  className={
                    "border-b border-[#828282] border-r p-1 relative h-[25px] overflow-hidden"
                  }
                >
                  <div className={"text-sm absolute left-1"}>{month.name}</div>
                </div>

                <div className={"flex grow h-6"}>
                  {Array.from({ length: month.days }, (_, i) => i).map(
                    (day) => (
                      <div
                        key={day}
                        className={"flex-1  border-r border-[#828282]"}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <Draggable
            nodeRef={rightDragRef}
            axis={"x"}
            bounds={rightBound}
            position={rightPosition}
            grid={[containerWidth / days, 0]}
            onDrag={handleDragRight}
            onStop={handleStopRight}
            onMouseDown={() => setIsRightDragging(true)}
          >
            <DragHandle
              ref={rightDragRef}
              isDragging={isRightDragging}
              day={(endMonthData?.dayOfMonth ?? 0) + 1}
              dragWidth={dragWidth}
            />
          </Draggable>

          <div
            className={
              "absolute right-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"
            }
            style={{ width: containerWidth - rightPosition.x }}
          />
        </div>

        {rightDay - leftDay === 1 && (
          <div className={"flex grow h-14 border-b border-[#828282]"}>
            {[leftDay, rightDay].map((day) => (
              <div
                key={day}
                className={
                  "flex flex-1 border-r border-[#828282] p-1 relative overflow-hidden"
                }
                style={{ flexGrow: 2 }}
              >
                <div className={"self-end text-[10px] absolute left-1"}>
                  {getDayAndMonth(day)} {monthsSlice[0].name}
                </div>
              </div>
            ))}
          </div>
        )}

        {monthsSlice.length >= 1 && rightDay - leftDay > 1 && (
          <div className={"flex grow h-14 border-b border-[#828282]"}>
            {monthsSlice.map((month) => (
              <div
                key={month.name}
                className={
                  "flex flex-1 border-r border-[#828282] p-1 relative overflow-hidden"
                }
                style={{ flexGrow: month.days }}
              >
                <div className={"self-end text-[10px] absolute left-1"}>
                  {month.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {rightDay - leftDay === 1 && (
          <div className={"flex h-6"}>
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
              14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            ].map((hour, index) => (
              <div
                key={index}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
                className={`relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
              >
                {hour}:00
              </div>
            ))}
          </div>
        )}

        {monthsSlice.length === 1 && rightDay - leftDay > 1 && (
          <div className={"flex h-6"}>
            {Array.from(
              { length: rightDay + 1 - leftDay },
              (_, i) => i + leftDay,
            ).map((day, index) => (
              <div
                key={day}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
                className={`relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r`}
                style={
                  day === today || (!isDragging && index === activeIndex)
                    ? { backgroundColor: "#E4DEFD" }
                    : day % 7 === 5 || day % 7 === 6
                      ? { backgroundColor: "#EBEBEB" }
                      : {}
                }
              >
                <div className={"absolute"}>{getDayAndMonth(day)}</div>
              </div>
            ))}
          </div>
        )}

        {monthsSlice.length > 1 && rightDay - leftDay > 1 && (
          <div className={"flex h-6"}>
            {weeksBetweenDates.map((week, index, array) => {
              if (array.length === 1) {
                const start = getDayAndMonth(leftDay);
                const end = getDayAndMonth(rightDay);

                return (
                  <div
                    key={`${leftDay}${rightDay}`}
                    onMouseEnter={() => onMouseEnter(index)}
                    onMouseLeave={onMouseLeave}
                    className={`whitespace-nowrap relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                  >
                    <div className={"absolute"}>
                      {start === end && start}
                      {start !== end && `${start}-${end}`}
                    </div>
                  </div>
                );
              }

              if (index === 0) {
                const start = getDayAndMonth(leftDay);
                const end = getDayAndMonth(week.end);

                return (
                  <div
                    key={`${leftDay}${week.end}`}
                    onMouseEnter={() => onMouseEnter(index)}
                    onMouseLeave={onMouseLeave}
                    className={`whitespace-nowrap relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                  >
                    <div className={"absolute"}>
                      {start === end && start}
                      {start !== end && `${start}-${end}`}
                    </div>
                  </div>
                );
              }

              if (index === array.length - 1) {
                const start = getDayAndMonth(week.start);
                const end = getDayAndMonth(rightDay);

                return (
                  <div
                    key={`${week.start}${rightDay}`}
                    onMouseEnter={() => onMouseEnter(index)}
                    onMouseLeave={onMouseLeave}
                    className={`whitespace-nowrap relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                  >
                    <div className={"absolute"}>
                      {start === end && start}
                      {start !== end && `${start}-${end}`}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`${week.start}${week.end}`}
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={onMouseLeave}
                  className={`relative overflow-hidden flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${!isDragging && index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                >
                  <div className={"absolute"}>
                    {getDayAndMonth(week.start)}-{getDayAndMonth(week.end)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
export const DatePicker = memo(DatePickerComponent);
