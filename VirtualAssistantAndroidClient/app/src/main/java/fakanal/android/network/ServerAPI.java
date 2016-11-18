package fakanal.android.network;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface ServerAPI {

    @FormUrlEncoded
    @POST("/hello/world/endpoint")
    Call<ResponseBody> helloWorldCall(@Field("message") String message);
}
