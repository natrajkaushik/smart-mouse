import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

/* Single threaded UDP server to receive touch position from mobile client */
public class UDPServer {

	private DatagramSocket serverSocket;
	private static final String SERVER_ADDRESS = "143.215.51.151";
	private static final int PORT = 7132;
	private static final int UDP_PACKET_BUFFER_SIZE = 1024;
	private static MouseController mc = MouseController.getMouseController();

	public UDPServer() {
		try {
			try {
				serverSocket = new DatagramSocket(PORT,
						InetAddress.getByName(SERVER_ADDRESS));
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("Server started on port 7132");
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void processPackets() throws IOException {
		byte[] _receiveData = new byte[UDP_PACKET_BUFFER_SIZE];
		while (true) {
			DatagramPacket receivePacket = new DatagramPacket(_receiveData,
					_receiveData.length);
			serverSocket.receive(receivePacket);
			String data = new String(receivePacket.getData());
			ObjectMapper mapper = new ObjectMapper();
			JsonNode reqJSON = mapper.readValue(data, JsonNode.class);

			String action = reqJSON.get("action").getTextValue();
			
			if ("MOUSE_CLICK".equals(action)) {
				mc.leftClick();
			} else if ("MOUSE_RIGHT_CLICK".equals(action)) {
				mc.rightClick();
			} else if ("MOUSE_MOVE".equals(action)) {
				JsonNode value = reqJSON.get("value");
				mc.scaleAndMove(value);
			} else if ("MOUSE_SPEED".equals(action)) {
				String value = reqJSON.get("value").getTextValue();
				if ("PLUS".equals(value)) {
					mc.setScale(1);
				} else {
					mc.setScale(-1);
				}
			}

			/*
			 * clearing the buffer used to receive UDP packet data to avoid data
			 * corruption
			 */
			for (int i = 0; i < UDP_PACKET_BUFFER_SIZE; i++) {
				_receiveData[i] = (byte) (0);
			}
		}
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			(new UDPServer()).processPackets();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
