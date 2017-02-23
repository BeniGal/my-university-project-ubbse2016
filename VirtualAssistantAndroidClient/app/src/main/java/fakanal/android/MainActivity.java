package fakanal.android;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import fakanal.android.network.ServerAPI;
import fakanal.android.network.ServerAPIBuilder;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements Callback<ResponseBody> {
    private static final String TAG = MainActivity.class.getName();

    private Button sendButton;
    private EditText editText;

    // Address is hardcoded for now, later may be injected.
    private String serverAddress = "fakanal.sloppy.zone";

    private MessageProcessor messageProcessor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ServerAPI API = new ServerAPIBuilder(serverAddress).build();

        sendButton = (Button) findViewById(R.id.button);
        editText = (EditText) findViewById(R.id.editText);

        messageProcessor = new MessageProcessor(this, API);

        // Simple click listener
        sendButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                String message = String.valueOf(editText.getText());
                editText.setText("");
                message = message.trim();
                messageProcessor.process(message);
            }
        });

        editText.requestFocus();
    }

    @Override
    public void onResponse(Call<ResponseBody> helloWorldApiCall, Response<ResponseBody> response) {
        if (response.isSuccessful()) {
            Log.i(TAG, "Successfully got answer from the server, response: " + response);
            try {
                JSONObject responseJson = new JSONObject(response.body().string());
                String responseString = responseJson.getString("response");
                messageProcessor.mimicOtherMessage(responseString);
            } catch (IOException | JSONException e) {
                Log.e(TAG, e.getMessage());
            }
        } else {
            Log.e(TAG, "Failed to get a success answer from the server, response: " + response.code());

        }
    }

    @Override
    public void onFailure(Call<ResponseBody> helloWorldApiCall, Throwable t) {
        Log.e(TAG, "Failed to get answer from the server", t);
        messageProcessor.mimicOtherMessage("Bad server connection");
    }
}
