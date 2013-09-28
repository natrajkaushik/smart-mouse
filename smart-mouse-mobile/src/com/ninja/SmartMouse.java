package com.ninja;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class SmartMouse extends Activity implements SensorEventListener {
	private SensorManager mSensorManager = null;

	private float[] nR = new float[16];
	private float[] I = new float[16];
	private float[] gravityVector = new float[3];
	private float[] geoMagneticVector = new float[3];
	private float[] orientationVector = new float[3];

	/* buttons for controlling roll, pitch and yaw */
	Button rollButton;
	Button pitchButton;
	Button yawButton;

	/* buttons for increasing/decreasing the scale of mouse motion */
	Button plusButton;
	Button minusButton;

	private JSONArray rotationDataList = new JSONArray();

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		mSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

		rollButton = (Button) findViewById(R.id.Roll);
		pitchButton = (Button) findViewById(R.id.Pitch);
		yawButton = (Button) findViewById(R.id.Yaw);

		plusButton = (Button) findViewById(R.id.Plus);
		minusButton = (Button) findViewById(R.id.Minus);

		setButtonClickListeners();
	}

	private void setButtonClickListener(Button b, final String action,
			final String value) {
		final int port = "ROTATION_MODE".equals(action) ? Parameters.WEB_SERVER_UDP_LISTENER_PORT
				: Parameters.MOUSE_CONTROLLER_SERVER_PORT;
		b.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				JSONObject toSend = new JSONObject();
				try {
					toSend.put("action", action);
					toSend.put("value", value);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				new SendToServer(port).execute(toSend.toString());
			}
		});
	}

	private void setButtonClickListeners() {
		setButtonClickListener(rollButton, "ROTATION_MODE", "ROLL");
		setButtonClickListener(pitchButton, "ROTATION_MODE", "PITCH");
		setButtonClickListener(yawButton, "ROTATION_MODE", "YAW");

		setButtonClickListener(plusButton, "MOUSE_SPEED", "PLUS");
		setButtonClickListener(minusButton, "MOUSE_SPEED", "MINUS");
	}

	/** List all the sensors available on the device **/
	private void listAllSensors() {
		List<Sensor> deviceSensors = mSensorManager
				.getSensorList(Sensor.TYPE_ALL);
		for (Sensor s : deviceSensors) {
			Utils.log(s.toString());
		}
	}

	@Override
	protected void onResume() {
		super.onResume();
		mSensorManager.registerListener(this,
				mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
				SensorManager.SENSOR_DELAY_NORMAL);
		mSensorManager.registerListener(this,
				mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD),
				SensorManager.SENSOR_DELAY_NORMAL);
		mSensorManager.registerListener(this, mSensorManager
				.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION),
				SensorManager.SENSOR_DELAY_NORMAL);
	}

	@Override
	protected void onPause() {
		super.onPause();
		mSensorManager.unregisterListener(this);
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
			gravityVector = event.values.clone();
		} else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
			// getRotationVector(event);
			geoMagneticVector = event.values.clone();
		} else if (event.sensor.getType() == Sensor.TYPE_LINEAR_ACCELERATION) {
			getLinearAcceleration(event);
		}

		getOrientationData(event, gravityVector, geoMagneticVector);
	}

	/* orientation of the android device (roll, pitch and yaw) */
	private void getOrientationData(SensorEvent event, float[] gravity,
			float[] geomag) {
		double yaw = 0;
		double pitch = 0;
		double roll = 0;

		if (gravity != null && geomag != null) {
			SensorManager.getRotationMatrix(nR, I, gravity, geomag);
			SensorManager.getOrientation(nR, orientationVector);

			yaw = Math.toDegrees(orientationVector[0]); /* angle around z-axis */
			pitch = Math.toDegrees(orientationVector[1]); /* angle around x-axis */
			roll = Math.toDegrees(orientationVector[2]); /* angle around y-axis */

			JSONObject rotationData = new JSONObject();
			try {
				rotationData.put("roll", String.valueOf(roll));
				rotationData.put("pitch", String.valueOf(pitch));
				rotationData.put("yaw", String.valueOf(yaw));
				rotationData.put("timestamp", String.valueOf(event.timestamp));

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			rotationDataList.put(rotationData);
			// log(rotationData);

			if (rotationDataList.length() > Parameters.ROTATION_BATCH_SIZE) {
				JSONObject toSend = new JSONObject();
				try {
					toSend.put("action", "ROTATION");
					toSend.put("value", rotationDataList);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				new SendToServer(Parameters.WEB_SERVER_UDP_LISTENER_PORT)
						.execute(toSend.toString());
				rotationDataList = new JSONArray();
			}
		}
	}

	private void getLinearAcceleration(SensorEvent event) {
		float[] values = event.values;

		float aX = values[0]; /* acceleration of the device along the x-axis */
		if (aX > Parameters.SWITCH_ACCELERATION) {
			JSONObject toSend = new JSONObject();
			try {
				toSend.put("action", "ACCELEROMETER");
				toSend.put("value", aX);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			new SendToServer(Parameters.WEB_SERVER_UDP_LISTENER_PORT)
					.execute(toSend.toString());
		}
	}
}
