package Classes;

//事故类
public class Accident {
    //订单编号
    private String order_number;
    //事故时间
    private String time;
    //事故地点
    private String place;
    //事故类型
    private String type;

    public void setOrder_number(String order_number) {
        this.order_number = order_number;
    }
    public void setTime(String time) {
        this.time = time;
    }
    public void setPlace(String place) {
        this.place = place;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getOrder_number() {
        return order_number;
    }
    public String getTime() { return time; }
    public String getPlace() {
        return place;
    }
    public String getType() {
        return type;
    }
}
