package com.ninja;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;

public class SmartMouseView extends View {
	private JSONArray touchPoints;
	private JSONArray scalePoints;
	private JSONObject toSend;

	private ScaleGestureDetector scaleDetector;
	private float scaleFactor = 1.0f;

	public SmartMouseView(Context context, AttributeSet attrs) {
		super(context, attrs);

		touchPoints = new JSONArray();
		scalePoints = new JSONArray();
		toSend = new JSONObject();

		this.setOnTouchListener(new MyOnTouchListener());
		scaleDetector = new ScaleGestureDetector(context, new ScaleListener());
		// TODO Auto-generated constructor stub
	}

	private void addTouchPoint(JSONObject position) {
		try {
			int length = touchPoints.length();
			if (length == 0) {
				touchPoints.put(position);
				return;
			}
			JSONObject lastPoint = touchPoints.getJSONObject(length - 1);
			Long t1 = (Long) lastPoint.get("timestamp");
			Long t2 = (Long) position.get("timestamp");
			if (t2 - t1 > Parameters.CLUTCH_TIMEOUT) {
				touchPoints = new JSONArray();
			}
			touchPoints.put(position);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private class MyOnTouchListener implements OnTouchListener {

		private long touchStartTime;
		private long twoFingerTapStart;
		private long currentTime, deltaTime, upTime, twoFingerClickTime;
		private boolean isDoubleTouch = false;

		public MyOnTouchListener() {
			this.touchStartTime = 0;
		}

		private void handleActionUp() {
			long _currentTime = System.currentTimeMillis();

			/* if it is a single finger click */
			if (!isDoubleTouch) {
				if (_currentTime - touchStartTime < Parameters.IS_CLICK_TIMEOUT) {
					toSend = new JSONObject();
					try {
						toSend.put("action", "MOUSE_CLICK");
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					new SendToServer(Parameters.MOUSE_CONTROLLER_SERVER_PORT)
							.execute(toSend.toString());
					touchPoints = new JSONArray();
				}
			} else {
				deltaTime = _currentTime - upTime;
				if (deltaTime <= Parameters.TWO_FINGER_TAP_TIMEOUT) {
					twoFingerClickTime = _currentTime - twoFingerTapStart;
					if (twoFingerClickTime <= Parameters.TWO_FINGER_CLICK_TIMEOUT) {
						Utils.log("Two Finger Click !!");
						toSend = new JSONObject();
						try {
							toSend.put("action", "MOUSE_RIGHT_CLICK");
						} catch (JSONException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						new SendToServer(Parameters.MOUSE_CONTROLLER_SERVER_PORT)
								.execute(toSend.toString());
					}
				}
				isDoubleTouch = false;
			}
		}

		@Override
		public boolean onTouch(View v, MotionEvent event) {
			currentTime = System.currentTimeMillis();
			scaleDetector.onTouchEvent(event);

			switch (event.getActionMasked()) {
			case MotionEvent.ACTION_DOWN:
				touchStartTime = currentTime;
				break;
			case MotionEvent.ACTION_MOVE:
				if (!scaleDetector.isInProgress()) {
					_addTouchPoint(event, currentTime);
					sendTouchPoints();
				}
				break;
			case MotionEvent.ACTION_UP:
				handleActionUp();
				break;
			case MotionEvent.ACTION_POINTER_DOWN:
				deltaTime = currentTime - touchStartTime;
				if (deltaTime <= Parameters.TWO_FINGER_TAP_TIMEOUT) {
					twoFingerTapStart = currentTime;
				}
				break;
			case MotionEvent.ACTION_POINTER_UP:
				upTime = currentTime;
				isDoubleTouch = true;
				break;
			default:
				break;
			}
			return true;
		}

	}

	private void _addTouchPoint(MotionEvent event, long currentTime) {
		int eventX = (int) event.getX();
		int eventY = (int) event.getY();
		JSONObject position = new JSONObject();

		try {
			position.put("x", eventX);
			position.put("y", eventY);
			position.put("timestamp", currentTime);
			addTouchPoint(position);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void sendTouchPoints() {
		if (touchPoints.length() >= Parameters.BATCH_SIZE) {
			toSend = new JSONObject();
			try {
				toSend.put("action", "MOUSE_MOVE");
				toSend.put("value", touchPoints);
			} catch (JSONException e) {
				/* Do nothing for now */
			}
			new SendToServer(Parameters.MOUSE_CONTROLLER_SERVER_PORT)
					.execute(toSend.toString());
			touchPoints = new JSONArray();
		}
	}

	private class ScaleListener extends
			ScaleGestureDetector.SimpleOnScaleGestureListener {
		@Override
		public boolean onScale(ScaleGestureDetector detector) {

			scaleFactor *= detector.getScaleFactor();

			/* Restrict the scaling factor to a maximum of 10 */
			scaleFactor = Math.max(0.1f, Math.min(scaleFactor, 10.0f));

			JSONObject scalePoint = new JSONObject();
			try {
				scalePoint.put("scale", scaleFactor);
				scalePoint.put("timestamp",
						System.currentTimeMillis() * 1000000);
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			scalePoints.put(scalePoint);

			if (scalePoints.length() >= Parameters.SCALE_BATCH_SIZE) {
				toSend = new JSONObject();
				try {
					toSend.put("action", "SCALE");
					toSend.put("value", scalePoints);
				} catch (JSONException e) {
					/* Do nothing for now */
				}

				new SendToServer(Parameters.WEB_SERVER_UDP_LISTENER_PORT)
						.execute(toSend.toString());
				scalePoints = new JSONArray();
			}

			return true;
		}
	}
}
