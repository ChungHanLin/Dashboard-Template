$(window).ready(function() {
    // php 讀取所有現存 log 檔案
    request_account_info();
    
    // 讀取 IP addr
    request_ip_analysis("false");
    
    $("#ip_analysis").click(function() {
        request_ip_analysis("true");
    });
});

// 回傳每個 client -> success, fail, collect
function request_account_info() {
    var url = "http://localhost:7999/account_info.php";
    
    $.ajax({
        type: "POST",
        url: url,
        success: function (response) {
            var json_data = JSON.parse(response);
            
            create_account_info(json_data);
        },
        error: function (err_msg) {
            console.log("Sth has wrong.");
        }
    });
}

function create_account_info(data) {
    var success = 0;
    var fail = 0;
    var collect = 0;
    var block;
    
    for (i = 0; i < data.length; i++) {
        block = create_account_card(data[i]);
        
        document.getElementById("account_info").append(block);
        // json 可能回傳數字是 int
        success = success + parseInt(data[i]["success"]);
        fail = fail + parseInt(data[i]["fail"]);
        collect = collect + parseInt(data[i]["collect"]);
    }
    
    document.getElementById("success_url").innerText = String(success);
    document.getElementById("fail_url").innerText = String(fail);
    document.getElementById("collect_url").innerText = String(collect);
    document.getElementById("client_num").innerText = String(data.length);
}

function create_account_card(info) {
    var card = document.createElement("div");
    card.className = "card scrollcard";
    
    
    var card_top = document.createElement("div");
    card_top.className = "card-up p-3 white-text";
    
    // 顏色先隨便給
    card_top.style.backgroundColor = "#00cec9";
    
    var card_top_text = document.createElement("p");
    card_top_text.style.visibility = "hidden"
    card_top_text.innerText = "i";
    card_top.append(card_top_text);
    
    var user_block = document.createElement("div");
    user_block.className = "avatar mx-auto white";
    user_block.style.marginTop = "-40px";
    user_block.style.borderRadius = "80px";
    user_block.style.width = "80px";
    
    var img = document.createElement("img");
    img.className = "rounded-circle";
    img.height = 80;
    img.src = "icon/user.png";
    user_block.append(img);
    
    var card_body = document.createElement("div");
    card_body.className = "card-body px-3 py-4";
    card_body.style.marginTop = "-20px";
    
    var account = document.createElement("div");
    account.className = "h4-responsive text-center";
    account.innerText = info["account"];
    
    var status = document.createElement("div");
    status.className = "text-center my-2";

    var i = document.createElement("i");
    i.className = "fas fa-circle";
    
    var span = document.createElement("span");

    if (info["status"] == "true") {
        status.style.color = "seagreen";
        span.innerText = " 在線";
    }

    else {
        status.style.color = "grey";
        span.innerText = " 離線";
    }
    
    status.append(i);
    status.append(span);
    
    var row = document.createElement("div");
    row.className = "row";
    
    var success = document.createElement("div");
    success.className = "col-4 text-center";
    
    var p_1 = document.createElement("p");
    p_1.className = "font-weight-bold mb-0";
    p_1.innerText = info["success"];
    
    var p_2 = document.createElement("p");
    p_2.className = "small text-uppercase mb-0";
    p_2.innerText = "Success";
    success.append(p_1);
    success.append(p_2);
    
    var fail = document.createElement("div");
    fail.className = "col-4 text-center border-left border-right";
    
    p_1 = document.createElement("p");
    p_1.className = "font-weight-bold mb-0";
    p_1.innerText = info["fail"];
    
    p_2 = document.createElement("p");
    p_2.className = "small text-uppercase mb-0";
    p_2.innerText = "Fail";
    fail.append(p_1);
    fail.append(p_2);
    
    var collect = document.createElement("div");
    collect.className = "col-4 text-center";
    
    var p_1 = document.createElement("p");
    p_1.className = "font-weight-bold mb-0";
    p_1.innerText = info["collect"];
    
    var p_2 = document.createElement("p");
    p_2.className = "small text-uppercase mb-0";
    p_2.innerText = "Collect";
    collect.append(p_1);
    collect.append(p_2);
    
    row.append(success);
    row.append(fail);
    row.append(collect);
    
    card_body.append(account);
    card_body.append(status);
    card_body.append(row);
    
    card.append(card_top);
    card.append(user_block);
    card.append(card_body);

    card.onclick = function() {
        request_log_file(info["account"]);
    };
    
    return card;
}

function request_log_file(account) {
    var url = "http://localhost:7999/log_file.php";
    var data = {account: account};
    
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response) {
            var data = JSON.parse(response);
            document.getElementById("log_account").innerText = data[0]["account"];
            document.getElementById("log_begin_time").innerText = data[0]["begin_time"];
            document.getElementById("log_finish_time").innerText = data[0]["finish_time"];
            document.getElementById("log_total_success_count").innerText = data[0]["total_success"];
            document.getElementById("log_recent_success_count").innerText = data[0]["recent_success"];
            document.getElementById("log_total_fail_count").innerText = data[0]["total_fail"];
            document.getElementById("log_recent_fail_count").innerText = data[0]["recent_fail"];
            document.getElementById("log_collect_count").innerText = data[0]["collect_count"];
        },
        error: function (err_msg) {
            console.log("Log has wrong.");
        }
    });
}
// 暫時 (當 IP 超多時會炸裂)
function request_ip_analysis(status) {
    var url = "http://localhost:7999/ip_analysis.php";
    var data = {status: status};
    
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response) {
            var data = JSON.parse(response);
            var table = document.getElementById("ip_table");
            $("#ip_table").empty();
            var tr, th, td_1, td_2, td_3;
            
            for (i = 0; i < data.length; i++) {
                tr = document.createElement("tr");
                th = document.createElement("th");
                th.innerText = data[i]["ip"];
                td_1 = document.createElement("td");
                td_1.innerText = data[i]["success"];
                td_2 = document.createElement("td");
                td_2.innerText = data[i]["fail"];
                td_3 = document.createElement("td");
                td_3.innerText = String((data[i]["rate"] * 100).toFixed(2)) + "%";
                tr.append(th);
                tr.append(td_1);
                tr.append(td_2);
                tr.append(td_3);
                table.append(tr);
            }
        },
        error: function (err_msg) {
            console.log("Log has wrong.");
        }
    });
}