package com.ninja;

public interface Parameters {
	public static final String SERVER_ADDRESS = "143.215.51.151";
	public static final String ANDROID_UDP_SERVER_ADDRESS = "";
	public static final int MOUSE_CONTROLLER_SERVER_PORT = 7132;
	public static final int WEB_SERVER_UDP_LISTENER_PORT = 7330;
	public static final int ANDROID_UDP_LISTENER_PORT = 7399;
	
	public static final int BATCH_SIZE = 2;
	public static final int ROTATION_BATCH_SIZE = 2;
	public static final int SCALE_BATCH_SIZE = 3;
	
	public static final int UDP_PACKET_BUFFER_SIZE = 1024;
	
	public static final float SWITCH_ACCELERATION = 2.0f;
	
	public static final int CLUTCH_TIMEOUT = 50;
	public static final int IS_CLICK_TIMEOUT = 130;
	public static final long TWO_FINGER_TAP_TIMEOUT = 25;
	public static final long TWO_FINGER_CLICK_TIMEOUT = 90;
}
