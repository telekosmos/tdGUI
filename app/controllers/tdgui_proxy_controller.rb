class TdguiProxyController < ApplicationController

	def test (myparam = params[:q]) # call is app.get '/tdgui_proxy/test?q=pffffffff'
		myparam = myparam ? myparam: "nillllllll"

		render :json => {'res' => "tdguiProxy Controller myparam #{myparam} ok"}.to_json, :layout => false

	end


# multiple_entries_retrieval
# gets multiple entries from uniprot and renders a json document with the most
# "interesting" attributes
# @param entries_query a comma separeted list of accessions, string classed
# @render just a json string in order to be processed by the client
	def multiple_entries_retrieval (entries_query = params[:entries])

#		entries = {:uniprotIds => ['Q13362','P12345','P0AEN3','P0AEN2','P0AEN1']}

#		entries = ['Q13362','P12345','P0AEN3'] unless entries.empty?
		tdgui_proxy = TdguiProxy.new
		json_entries = tdgui_proxy.get_multiple_entries(entries_query)

		render :json => json_entries, :layout => false
	end

end