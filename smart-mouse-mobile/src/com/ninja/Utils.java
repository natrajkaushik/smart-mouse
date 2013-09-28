package com.ninja;

import android.util.Log;

public class Utils {
	public static void log(Object o) {
		if (o instanceof String) {
			Log.d("MESSAGE", (String) o);
		} else {
			Log.d("MESSAGE", String.valueOf(o));
		}
	}
}
