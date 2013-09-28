

import java.awt.AWTException;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Robot;
import java.awt.event.InputEvent;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedList;

import org.codehaus.jackson.JsonNode;

public class MouseController {

	private static MouseController mc = new MouseController();
	private Robot robot;
	private int SCALE = 1;
	private static final int MOTION_SLEEP_INTERVAL = 30;

	public static MouseController getMouseController() {
		return mc;
	}
	
	public void setScale(int mode){
		if(mode == 1){
			SCALE++;
		}else if(mode == -1){
			if(SCALE != 1){
				SCALE--;
			}
		}
	}

	/* Moves mouse pointer absolutely to (x, y) */
	public void moveAbsolute(int x, int y) {
		robot.mouseMove(x, y);
	}

	/*
	 * Moves mouse pointer from current location using increments along x and y
	 * axes
	 */
	private void moveRelative(int deltaX, int deltaY) {
		Point currentLocation = MouseInfo.getPointerInfo().getLocation();
		int newX = currentLocation.x + deltaX;
		int newY = currentLocation.y + deltaY;
		robot.mouseMove(newX, newY);
	}

	public void leftClick() {
		robot.mousePress(InputEvent.BUTTON1_MASK);
		robot.mouseRelease(InputEvent.BUTTON1_MASK);
	}

	public void rightClick() {
		robot.mousePress(InputEvent.BUTTON3_MASK);
		robot.mouseRelease(InputEvent.BUTTON3_MASK);
	}

	public void doubleClick() {
		robot.mousePress(InputEvent.BUTTON1_MASK);
		robot.mouseRelease(InputEvent.BUTTON1_MASK);
		robot.mousePress(InputEvent.BUTTON1_MASK);
		robot.mouseRelease(InputEvent.BUTTON1_MASK);
	}

	private void sleep(int time) {
		robot.delay(time);
	}

	public void scaleAndMove(JsonNode node) {
		Iterator<JsonNode> iterator = node.getElements();
		LinkedList<TouchPosition> touchPositions = new LinkedList<TouchPosition>();
		while (iterator.hasNext()) {
			JsonNode elem = iterator.next();
			TouchPosition tp = new TouchPosition(elem.get("x").asInt(), elem
					.get("y").asInt(), elem.get("timestamp").asLong());
			touchPositions.addLast(tp);
		}

		if (touchPositions.size() <= 1) {
			return;
		}

		Collections.sort(touchPositions, new Comparator<TouchPosition>() {
			@Override
			public int compare(TouchPosition o1, TouchPosition o2) {
				// TODO Auto-generated method stub
				return (int) (o1.getTimestamp() - o2.getTimestamp());
			}

		});

		int length = touchPositions.size();
		int count = 0;
		while (count < length - 1) {
			/* Extract the two consecutive touch points */
			TouchPosition touch_point_1 = touchPositions.get(count);
			TouchPosition touch_point_2 = touchPositions.get(count + 1);

			int delta_x = SCALE * (touch_point_2.x - touch_point_1.x);
			int delta_y = SCALE * (touch_point_2.y - touch_point_1.y);
			// int delta_time = (int)(touch_point_2.timestamp -
			// touch_point_1.timestamp);

			moveRelative(delta_x, delta_y);
			sleep(MOTION_SLEEP_INTERVAL);
			count++;
		}
	}

	private MouseController() {
		try {
			this.robot = new Robot();
		} catch (AWTException e) {
			/* Do nothing */
		}
	}

	private class TouchPosition {
		private int x;
		private int y;
		private long timestamp;

		public TouchPosition(int x, int y, long timestamp) {
			this.x = x;
			this.y = y;
			this.timestamp = timestamp;
		}

		public int getX() {
			return this.x;
		}

		public int getY() {
			return this.y;
		}

		public long getTimestamp() {
			return this.timestamp;
		}
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
