package fakanal.android.network;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ServerAPI {

    @POST("/googleSearch")
    Call<ResponseBody> helloWorldCall(
            @Header("Content-Type") String contentType,
            @Body RequestBody payload
    );
}
